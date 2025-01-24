import { Controller, Delete, Param, Post, Request, UseGuards } from '@nestjs/common';
import { EventsTypeService } from './events-type.service';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';

@Controller('events-type')
export class EventsTypeController {
    constructor(private eventsTypeService: EventsTypeService){}

    @Post(':eventId/:eventsActivityId')
    @UseGuards(JwtAuthGuard)
    async addTypeToEvent(
        @Param('eventId') eventId: string,
        @Param('eventsActivityId') eventsActivityId: string, 
        @Request() req
    ){
        const userId = req.user.userId;
        const addTypeToEvent = await this.eventsTypeService.addTypeToEvent(+eventId,+eventsActivityId,userId)
        return addTypeToEvent;
    }

    @Delete(':eventId/:eventsActivityId')
    @UseGuards(JwtAuthGuard)
    async deleteEventType(
        @Param('eventId') eventId: string,
        @Param('eventsActivityId') eventsActivityId: string, 
        @Request() req
    ){
        const userId = req.user.userId;
        const deleteEventType = await this.eventsTypeService.deleteEventsTypeActivity(+eventId,+eventsActivityId,userId)
        return deleteEventType
    }
}
