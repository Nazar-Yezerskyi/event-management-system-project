import { Body, Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import { TypeOfEventsActivityService } from './type-of-events-activity.service';
import { createEventTypeDto } from './dtos/create-event-type.dto';
import { AdminGuard } from 'src/guards/admin.guard';

@Controller('type-of-events-activity')
export class TypeOfEventsActivityController {
    constructor(
        private typeOfEventsActivityService: TypeOfEventsActivityService
    ){}

    @Get()
    async getTypeOfEventsActivity(){
        const typeOfEventsActivity = await this.typeOfEventsActivityService.findAllEventTypes()
        return typeOfEventsActivity;
    }

    @Post()
    @UseGuards(AdminGuard)
    async createEventType(@Body() eventData: createEventTypeDto){
        const createEventType = await this.typeOfEventsActivityService.createEventType(eventData.name)
        return createEventType;
    }

    @Delete(':eventTypeId')
    @UseGuards(AdminGuard)
    async deleteEventType(@Param('eventTypeId') eventTypeId: string){
        const deleteEventType = await this.typeOfEventsActivityService.deleteEventType(+eventTypeId)
        return deleteEventType;
    }
}
