import { Body, Controller, Post, Request } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CreatePaymentIntentDto } from './dtos/create-payment-intent.dto';

@Controller('payment')
export class PaymentController {
    constructor(private paymentService: PaymentService){}

    @Post('create-payment-intent')
    async createPaymentIntent(@Body() body: CreatePaymentIntentDto) {
        const { amount, currency, orderTicketId, userId } = body;
        return await this.paymentService.createPaymentIntent(amount, currency, orderTicketId, userId);
    }

    @Post('checkout-session')
    async createCheckoutSession(
        @Body() body: {paymentIntentId: string}
    ) {
        return this.paymentService.createCheckoutSession(body.paymentIntentId);
    }
    
    @Post('webhook')
    async handleStripeWebhook(@Body() body: any, @Request() req: any) {
        const sig = req.headers['stripe-signature'];
        const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
        let event;
        event = this.paymentService.getStripe().webhooks.constructEvent(body, sig, endpointSecret);

        if (event.type === 'payment_intent.succeeded') {
            const paymentIntent = event.data.object;
            await this.paymentService.updatePaymentStatus(paymentIntent.id, 'succeeded');
        } else if (event.type === 'payment_intent.payment_failed') {
            const paymentIntent = event.data.object;
            await this.paymentService.updatePaymentStatus(paymentIntent.id, 'failed');
        }

        return { status: 'success' };
    }
}
