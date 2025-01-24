import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { EventsService } from 'src/events/events.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { TypeOfEventsActivityService } from 'src/type-of-events-activity/type-of-events-activity.service';

@Injectable()
export class EventsTypeService {
    constructor(
        private prisma: PrismaService,
        private eventsService: EventsService,
        private typeOfEventsActivity: TypeOfEventsActivityService
    ){}

    private async findRecord(eventId: number,typeOfEventsActivityId: number){
        const findRecord = await this.prisma.eventsTypes.findFirst({
            where:{
                eventId,
                typeOfEventsActivityId
            }
        })
        return findRecord

    }

    async addTypeToEvent(eventId: number,typeOfEventsActivityId: number, userId: number){
        const findRecord = await this.findRecord(eventId,typeOfEventsActivityId)
        if(findRecord){
            throw new BadRequestException('Event type of activity already added')
        }
        const findEvent = await this.eventsService.findOneEvent(eventId)
        if(!findEvent){
            throw new NotFoundException('Event not found')
        }
        if(findEvent.Companies.userId !== userId){
            throw new ForbiddenException('You can only add type of activity to your event')
        }
        const findTypeOfActivity = await this.typeOfEventsActivity.findOne(typeOfEventsActivityId)
        if(!findTypeOfActivity){
            throw new NotFoundException('Event type of activity not found')
        }

        const addedTypeToEvent = await this.prisma.eventsTypes.create({
            data:{
                eventId,
                typeOfEventsActivityId 
            }
        })

        return addedTypeToEvent;
    }

    async deleteEventsTypeActivity(eventId: number,typeOfEventsActivityId: number, userId: number){
        const findRecord = await this.findRecord(eventId,typeOfEventsActivityId)
        if(!findRecord){
            throw new NotFoundException('Event type of activity not added')
        }
        const findEvent = await this.eventsService.findOneEvent(eventId)
        if(!findEvent){
            throw new NotFoundException('Event not found')
        }
        if(findEvent.Companies.userId !== userId){
            throw new ForbiddenException('You can only delete type of activity to your event')
        }
        const findTypeOfActivity = await this.typeOfEventsActivity.findOne(typeOfEventsActivityId)
        if(!findTypeOfActivity){
            throw new NotFoundException('Event type of activity not found')
        }

        const deleted = await this.prisma.eventsTypes.delete({
            where:{
                id: findRecord.id
            }
        })
        return deleted;
    }

}
