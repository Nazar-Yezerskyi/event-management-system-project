import { MailerService } from '@nestjs-modules/mailer';
import { BadRequestException, ForbiddenException, Inject, Injectable, NotFoundException, forwardRef } from '@nestjs/common';
import { EventsService } from 'src/events/events.service';
import { OrderPlacesService } from 'src/order-places/order-places.service';
import { PaymentService } from 'src/payment/payment.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { PromoCodesService } from 'src/promo-codes/promo-codes.service';

@Injectable()
export class OrderTicketService {
    constructor(
        private prisma: PrismaService,
        private eventsService: EventsService,
        private orderPlacesService: OrderPlacesService,
        private promoCodeService: PromoCodesService,
        private mailerService: MailerService,
        @Inject(forwardRef(() => PaymentService))
        private paymentService: PaymentService,
    ){}
    async findAllUserTickets(userId: number){
        const tickets = await this.prisma.orderTicket.findMany({
            where:{
                userId
            },
            include:{
                Events: true
            }
        })
        return tickets
        
    }
    async findAllActiveUserTickets(userId: number){
        const tickets = await this.prisma.orderTicket.findMany({
            where:{
                userId,
                Events:{
                    date:{
                        gte: new Date()
                    }
                }
            },
            include:{
                Events: true
            }
        })
        return tickets
    }

    async findOrderedTicketByEvent(eventId: number, userId: number){
        const findEvent = await this.eventsService.findOneEvent(eventId)
        if(!findEvent){
            throw new NotFoundException('Event not found')
        }
        if(findEvent.Companies.id !== userId){
            throw new ForbiddenException('You can view tickets only for your company')
        }
        const tickets = await this.prisma.orderTicket.findMany({
            where:{
                eventId
            },
            include: {
                Users: true
            }
        })
        return tickets
    }

    async createOrder(eventId: number, userId: number, seatsId: string, promoCode?: string) {
        const findEvent = await this.eventsService.findOneEvent(eventId);
        if (!findEvent) throw new NotFoundException('Event not found');
    
        const seatIds = seatsId.split(',').map(Number);
        const findOrderedSeats = await this.orderPlacesService.findOrderedSeats(seatIds);
        const orderedSeatIds = new Set(findOrderedSeats.map(seat => seat.placeId));
        const availableSeats = seatIds.filter(seat => !orderedSeatIds.has(seat));
    
        if (availableSeats.length === 0) {
            throw new BadRequestException(`Seats already booked`);
        }
        if (availableSeats.length !== seatIds.length) {
            throw new BadRequestException(`You can only book seat(s) with id: ${availableSeats}, other seats are already booked`);
        }
    
        let totalPrice = findEvent.ticket_price * availableSeats.length;
    
        if (promoCode) {
            totalPrice = await this.promoCodeService.validatePromoCode(promoCode, findEvent, totalPrice);
        }
    
        const createOrder = await this.prisma.orderTicket.create({
            data: {
                userId,
                eventId,
                totalPrice,
                promoCode: promoCode || null,
                OrderPlaces: {
                    create: availableSeats.map(placeId => ({ placeId })),
                },
            },
        });
        await this.paymentService.createPaymentIntent(createOrder.totalPrice,'usd',createOrder.id,createOrder.userId)
        return createOrder
    }

    async findTicket(ticketId: number){
        const find = await this.prisma.orderTicket.findUnique({
            where:{
                id: ticketId
            },
            include:{
                OrderPlaces:{
                    include:{
                        Places:{
                            select:{
                                seatNumber:true
                            }
                        }
                    }
                }
            }
        })
        return find
    }

    async deleteTicket(ticketId: number, userId: number){
        const findTicket = await this.findTicket(ticketId)
        if(!findTicket){
            throw new NotFoundException('Ticket not found')
        }
        if(findTicket.userId !== userId){
            throw new ForbiddenException('You can cancel only your ticket')
        }
        const deletedPlaces = await this.orderPlacesService.deleteOrderedSeats(findTicket.OrderPlaces)
        console.log(findTicket)
        const deletedTicket = await this.prisma.orderTicket.delete({
            where:{
                id: findTicket.id,
            }
        })
        return {ticket: deletedTicket, places: deletedPlaces}

    }

    async updateShowParticipation(ticketId: number, userId:number, status: string){
        const findTicket = await this.findTicket(ticketId)
        if(!findTicket){
            throw new NotFoundException('Ticket not found')
        }
        if(findTicket.userId !== userId){
            throw new ForbiddenException('You can only update your ticket')
        }
        const updatedStatus = status === 'true'

        const updatedShowParticipation = await this.prisma.orderTicket.update({
            where:{
                id: ticketId
            },
            data:{
                showParticipation: updatedStatus
            }
        })
        return updatedShowParticipation
    }

    async sendTicketDetails(eventId: number, userEmail: string, ticketId: number){
        const findEvent = await this.eventsService.findOneEvent(eventId)
        const findTicket = await this.findTicket(ticketId)
        console.log(findTicket.OrderPlaces)
        const seats = findTicket.OrderPlaces.map((place =>(place.Places.seatNumber))).join(',')
        await this.mailerService.sendMail({
            to: userEmail,
            subject: 'Ticket Details',
            text: 
                `Ticket №${findTicket.id}
        
                Event: ${findEvent.name}
        
                Ordered places: ${seats}
        
                Date: ${findEvent.date.toISOString().split('T')[0]}
                Start time: ${findEvent.start_time.toISOString().split('T')[1].slice(0,5)}
        
                Where? - ${findEvent.country}, ${findEvent.city}, ${findEvent.street}`
            .trim(),
        });
    }

    async countSoldTicketByCompany(companyId:number, start_date?: string, end_date?: string){
        let startDate: Date
        let endDate: Date
        if(start_date){
            startDate = new Date(start_date)
        }
        if(end_date){
            endDate = new Date(end_date)
        }
        const orderPlaceCount = await this.prisma.events.findMany({
            where: {
              companyId: companyId, 
              date:{
                gte: startDate,
                lte: endDate
              }
            },
            include: {
              OrderTicket: {
                include: {
                  OrderPlaces: true,
                },
              },
            },
          }).then(events => {
            return events.map(event => ({
              eventId: event.id,
              orderPlaceCount: event.OrderTicket.reduce((count, orderTicket) => count + orderTicket.OrderPlaces.length, 0),
            }));
          });
          
         return orderPlaceCount;
    }
    async countSoldTicketsByEvent(eventId: number){
        const findEvent = await this.eventsService.findOneEvent(eventId)
        if(!findEvent){
            throw new NotFoundException('Event not found')
        }
        const countTickets = await this.prisma.orderPlaces.count({
            where:{
               OrderTicket:{
                eventId,
               }
            }
        })
        return countTickets
    }

    async calculatePromoLoss(eventId: number){
        const appliedPromoCodes = await this.prisma.orderTicket.aggregate({
            where:{
                eventId,
            },
            _count:{
                promoCode: true
            },
            _sum:{
                totalPrice: true
            },

            
        })
        const appliedPromoCodesValue = appliedPromoCodes._sum.totalPrice
        const number_of_using_promo = appliedPromoCodes._count.promoCode
        return {appliedPromoCodesValue, number_of_using_promo}
    }
    
}
