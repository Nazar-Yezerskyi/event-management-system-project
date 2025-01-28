import { Body, Controller, Delete, Get, Param, Post, Put, Query, Request, UseGuards } from '@nestjs/common';
import { EventsService } from './events.service';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { CreateEventDto } from './dtos/create-event.dto';
import { UpdateEventDto } from './dtos/update-event.dto';

@Controller('events')
export class EventsController {
    constructor(private eventsService: EventsService){}

    @Get()
    async findEvents(){
        const findEvent = await this.eventsService.findAllEvents()
        return findEvent;
    }

    @Post()
    @UseGuards(JwtAuthGuard)
    async createEvent(@Body() eventData: CreateEventDto,@Request() req){
        const userId = req.user.userId
        const createEvent = await this.eventsService.createEvent(eventData, userId)
        return createEvent;
    }

    @Put(':eventId')
    @UseGuards(JwtAuthGuard)
    async updateEvent(@Body() updatedData: UpdateEventDto,@Param('eventId') eventId: string,@Request() req){
        const userId = req.user.userId
        const updateEvent = await this.eventsService.updateEvent(updatedData,+eventId,userId)
        return updateEvent;
    }

    @Delete(':eventId')
    @UseGuards(JwtAuthGuard)
    async deleteEvent(@Param('eventId') eventId: string, @Request() req){
        const userId = req.user.userId;
        const deleteEvent = await this.eventsService.deleteEvent(+eventId,userId)
        return deleteEvent;
    }

}
