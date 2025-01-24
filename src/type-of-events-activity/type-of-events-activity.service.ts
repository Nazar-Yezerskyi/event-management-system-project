import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TypeOfEventsActivityService {
    constructor(private prisma: PrismaService){}

    async findAllEventTypes(){
        const EventTypes = await this.prisma.typeOfEventsActivity.findMany()
        return EventTypes;
    }

    async findEventTypeByName(name: string){
        const findEventType = await this.prisma.typeOfEventsActivity.findFirst({
            where:{
                name
            }
        })
        return findEventType
    }
    async findOne(id: number){
        const findOne = await this.prisma.typeOfEventsActivity.findUnique({
            where:{
                id
            }
        })
        return findOne
    }

    async createEventType(name: string){
        const findEventType = await this.findEventTypeByName(name)
       
        if(findEventType){
            throw new BadRequestException('Event type already exists')
        }
        const createdEventType = await this.prisma.typeOfEventsActivity.create({
            data:{
                name
            }
        })
        return createdEventType;
    }

    async deleteEventType(id: number){
        const findEventType = await this.findOne(id)
        if(!findEventType){
            throw new NotFoundException('Event type not found')
        }
        const deleted = await this.prisma.typeOfEventsActivity.delete({
            where:{
                id
            }
        })
        return deleted
    }
}
