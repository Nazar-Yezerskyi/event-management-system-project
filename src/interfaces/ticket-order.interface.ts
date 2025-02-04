export interface TicketOrder{
    eventId: number,
    orderPlaceCount: number,
    expectedPrice?: number,
    appliedPromoCodeProfit? :number,
    netProfit? :number,
    eventName?: string
    attendance?: string,
    promoCodeUsed?: number
}