import { Body, Controller, Delete, Get, Param, Post, Put, Query, Request, UseGuards } from '@nestjs/common';
import { OrderTicketService } from './order-ticket.service';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { CreateOrderDto } from './dtos/create-order.dto';

@Controller('order-ticket')
export class OrderTicketController {
    constructor(private orderTickerService: OrderTicketService){}

    @Get('/all-tickets')
    @UseGuards(JwtAuthGuard)
    async getAllTicketsByUser(@Request() req){
        const userId = req.user.userId
        const getAllTicketByUser = await this.orderTickerService.findAllUserTickets(userId)
        return getAllTicketByUser
    }
    @Get('/active-tickets')
    @UseGuards(JwtAuthGuard)
    async getActiveTicketsByUser(@Request() req){
        const userId = req.user.userId
        const getActiveTicketsByUser = await this.orderTickerService.findAllActiveUserTickets(userId)
        return getActiveTicketsByUser
    }

    @Get('/tickets-for-event/:eventId')
    @UseGuards(JwtAuthGuard)
    async findOrderedTicketByEvent(@Param('eventId') eventId: string, @Request() req){
        const userId = req.user.userId
        const tickets = await this.orderTickerService.findOrderedTicketByEvent(+eventId,userId)
        return tickets
    }

    @Post(':eventId')
    @UseGuards(JwtAuthGuard)
    async createOrder(@Param('eventId') eventId: string,@Body() body: CreateOrderDto, @Request() req){
        const userId = req.user.userId
        const order = await this.orderTickerService.createOrder(+eventId,userId,body.placeId,body.promoCode)
        return order;
    }

    @Delete(':ticketId')
    @UseGuards(JwtAuthGuard)
    async cancelTicket(@Param('ticketId') ticketId: string, @Request() req){
        const userId = req.user.userId
        const canceledTicket = await this.orderTickerService.deleteTicket(+ticketId,userId)
        return canceledTicket;
    }

    @Put(':ticketId')
    @UseGuards(JwtAuthGuard)
    async updateShowParticipation(@Param('ticketId') ticketId: string, @Query('status') status: string, @Request() req){
        const userId = req.user.userId
        const updatedShowParticipation = await this.orderTickerService.updateShowParticipation(+ticketId,+userId,status)
        return updatedShowParticipation;
    }
}
