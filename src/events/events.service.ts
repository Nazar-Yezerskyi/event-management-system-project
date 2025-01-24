import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateEventDto } from './dtos/create-event.dto';
import { CompanyService } from 'src/company/company.service';
import { UpdateEventDto } from './dtos/update-event.dto';
import { MailerService } from '@nestjs-modules/mailer';


@Injectable()
export class EventsService {
    constructor(
        private prisma: PrismaService,
        private companyService: CompanyService,
    ){}
    
    async findOneEvent(id: number){
        const event = this.prisma.events.findUnique({
            where:{
                id
            },
            include:{
                Companies: true,
                OrderTicket:{
                    include:{
                        Users: true
                    }
                }
            }
        })
        return event
    }
   
    async findAllEvents(){
        const events = this.prisma.events.findMany()

        return events
    }
    async createEvent(eventData: CreateEventDto, userId: number){
        const findCompanyByUser = await this.companyService.findCompanyByUser(userId)
        if(!findCompanyByUser){
            throw new ForbiddenException('You cannot create event, because u don\'t have company')
        }
        const startTimeISO = new Date(`${eventData.date}T${eventData.start_time}:00.000Z`)
        const createdEvent = await this.prisma.events.create({
            data:{
                ...eventData,
                date: new Date(eventData.date),
                start_time: startTimeISO,
                companyId: findCompanyByUser.id
            }
        })
        return createdEvent
    }

    private calculateStartTime(date?: string, start_time?: string, eventStartTime?: Date){
        const isoDate = eventStartTime?.toISOString();
        const currentDate = isoDate?.split('T')[0] || '';
        const currentTime = isoDate?.split('T')[1] || '';
    
        if (date && start_time) {
            return new Date(`${date}T${start_time}:00.000Z`);
        }
        if (date) {
            return new Date(`${date}T${currentTime}`);
        }
        if (start_time) {
            return new Date(`${currentDate}T${start_time}:00.000Z`);
        }
        return eventStartTime!;
    }
    

    async updateEvent(updatedData: UpdateEventDto, eventId: number, userId: number) {
        const findEvent = await this.findOneEvent(eventId);
    
        if (!findEvent) {
            throw new NotFoundException('Event not found');
        }
        if (findEvent.Companies.userId !== userId) {
            throw new ForbiddenException('You can only update your event');
        }

        const startTimeISO = this.calculateStartTime(
            updatedData.date,
            updatedData.start_time,
            findEvent.start_time
        );
    
        const updatedEvent = await this.prisma.events.update({
            where: { id: findEvent.id },
            data: {
                ...updatedData,
                date: updatedData.date ? new Date(updatedData.date) : findEvent.date, 
                start_time: startTimeISO, 
            },
        });
    
        return updatedEvent;
    }

    async deleteEvent(id: number, userId: number){
        const findEvent = await this.findOneEvent(id)
        if(!findEvent){
            throw new NotFoundException('Event not found')
        }
        if(findEvent.Companies.userId !== userId){
            throw new ForbiddenException('You can only delete your event')
        }
        const deletedEvent = await this.prisma.events.delete({
            where:{
                id
            }
        })
        return deletedEvent;
    }
}