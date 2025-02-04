import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CompanyService } from 'src/company/company.service';
import { EventsService } from 'src/events/events.service';
import { TicketOrder } from 'src/interfaces/ticket-order.interface';
import { OrderTicketService } from 'src/order-ticket/order-ticket.service';

@Injectable()
export class StatisticsService {
    constructor(
        private companyService: CompanyService,
        private eventsService: EventsService,
        private orderTiketsService: OrderTicketService
    ){}

    async getStatisticByEvent(eventId: number, userId: number){
        const findEvent = await this.eventsService.findOneEvent(eventId)
        if(!findEvent){
            throw new NotFoundException('Event not found')
        }
        if(findEvent.Companies.userId !== userId){
            throw new ForbiddenException('You can get statistic only about your company')
        }
        const countTicket = await this.orderTiketsService.countSoldTicketsByEvent(eventId)
        const totalProfit = countTicket * findEvent.ticket_price
        const appliedPromoCode = await this.orderTiketsService.calculatePromoLoss(eventId)
        const promoCodeUsed = appliedPromoCode.number_of_using_promo
        const attendance = (countTicket * 100)/findEvent.number_of_seats
        let netProfit: number 
        if(appliedPromoCode.appliedPromoCodesValue !==0){
            netProfit = totalProfit - appliedPromoCode.appliedPromoCodesValue
        }
        
        return {
            ticketsSold: countTicket,
            expectedProfit: totalProfit,
            appliedPromoCodeProfit: appliedPromoCode.appliedPromoCodesValue || 0,
            netProfit,
            attendance: `${attendance}%`,
            promoCodeUsed
        }

     }

     async getStatisticByCompany(companyId: number, userId: number, start_date?: string, endDate?: string) {
        const findCompany = await this.companyService.findCompany(companyId);
        if (!findCompany) {
            throw new NotFoundException('Company not found');
        }
        if (findCompany.userId !== userId) {
            throw new ForbiddenException('You can get statistics only about your company');
        }
    
        const countTicketsByEvents: TicketOrder[] = await this.orderTiketsService.countSoldTicketByCompany(companyId, start_date, endDate);
    
        const eventIds = countTicketsByEvents.map(ticket => ticket.eventId);
    
        const events = await Promise.all(eventIds.map(id => this.eventsService.findOneEvent(id)));
    
        const promoLosses = await Promise.all(eventIds.map(id => this.orderTiketsService.calculatePromoLoss(id)));
    
        return countTicketsByEvents.map((ticket, index) => {
            const findEvent = events[index]; 
            const netProfit = promoLosses[index]; 
            
            const expectedPrice = findEvent.ticket_price * ticket.orderPlaceCount;
            const appliedPromoCodeProfit = expectedPrice - netProfit.appliedPromoCodesValue;
            const attendance = (ticket.orderPlaceCount * 100) / findEvent.number_of_seats;
    
            return {
                event: findEvent.name,
                ticketsSold: ticket.orderPlaceCount,
                expectedProfit: expectedPrice,
                appliedPromoCodeProfit: appliedPromoCodeProfit || 0,
                netProfit: netProfit.appliedPromoCodesValue,
                attendance: `${attendance}%`,
                promoCodeUsed: netProfit.number_of_using_promo,
            };
        });
    }
}
