import { Body, Controller, Post, RawBodyRequest, Req } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CreatePaymentIntentDto } from './dtos/create-payment-intent.dto';
import { PaymentStatus } from 'src/enums/payment-status.enum';

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
    async handleStripeWebhook(@Req() req: RawBodyRequest<Request>) {
      const sig = req.headers['stripe-signature'];
      const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
      const object = JSON.parse(req.rawBody.toString())
      console.log(object)
      let event;
      try {
        event = this.paymentService.getStripe().webhooks.constructEvent(req.rawBody, sig, endpointSecret);
        if (event.data.object.status === PaymentStatus.SUCCEEDED) {
          const paymentIntent = event.data.object;
          return await this.paymentService.updatePaymentStatus(paymentIntent.metadata.paymentIntentId, PaymentStatus.SUCCEEDED, paymentIntent.receipt_url);
        } else {
          console.log('Unhandled event type:', event.type);
        }
      } catch (error) {
        console.error('Error processing webhook event:', error);
        throw new Error('Webhook processing failed');
      }
    }
}
