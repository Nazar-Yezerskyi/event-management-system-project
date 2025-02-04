import { MailerService } from '@nestjs-modules/mailer';
import { Inject, Injectable, NotFoundException, forwardRef } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { OrderTicketService } from 'src/order-ticket/order-ticket.service';
import { UserService } from 'src/user/user.service';
import Stripe from 'stripe';
import { PaymentStatus } from 'src/enums/payment-status.enum';

@Injectable()
export class PaymentService {
    private stripe: Stripe

    constructor(
      private prisma:PrismaService,
      private mailerService: MailerService,
      private userService: UserService,
      @Inject(forwardRef(() => OrderTicketService))
      private orderTiketService: OrderTicketService
    ) {
        const stripeSecretKey = process.env.STRIPE_SECRET_KEY
        //@ts-ignore
        this.stripe = new Stripe(stripeSecretKey, {
          apiVersion: '2025-01-27.acacia',  
        });
    }

    getStripe(){
      return this.stripe;
    }

    async createPaymentIntent(amount: number, currency: string, orderTicketId: number, userId: number) {
      const findUser = await this.userService.findOneUser(userId)
      
      if(!findUser){
        throw new NotFoundException('User not found')
      }
      
      const paymentIntent = await this.stripe.paymentIntents.create({
        amount,
        currency,
        metadata: { userId: userId.toString() },
      });
  
      const paymentData = await this.prisma.payment.create({
        data: {
          amount: amount * 100,
          paymentMethod: 'card',
          currency,
          status: paymentIntent.status,
          paymentIntentId: paymentIntent.id,
          userId,
          orderTicketId 
        },
      });
      
      const createCheckoutSession = await this.createCheckoutSession(paymentData.paymentIntentId) 
      await this.mailerService.sendMail({
        to: findUser.email,
        subject: `Paying for your ticket, ticketId: ${paymentData.orderTicketId}`,
        text: `click this url and pay: ${createCheckoutSession.url}`,
      })
      return {
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
      };
      
    }
    async createCheckoutSession(paymentIntentId: string) {
      const paymentIntent = await this.stripe.paymentIntents.retrieve(paymentIntentId);
  
      if (!paymentIntent) {
          throw new Error('PaymentIntent not found');
      }
  
      const session = await this.stripe.checkout.sessions.create({
          payment_method_types: ['card'],
          line_items: [
              {
                  price_data: {
                      currency: paymentIntent.currency,
                      product_data: {
                          name: 'Order Payment',
                      },
                      unit_amount: paymentIntent.amount,
                  },
                  quantity: 1,
              },
          ],
          mode: 'payment',
          payment_intent_data:{
            metadata:{
                paymentIntentId
            }
          },
          success_url: `https://example.com/success?payment_intent=${paymentIntentId}`,
          cancel_url: `https://example.com/cancel?payment_intent=${paymentIntentId}`,
          metadata: {
              paymentIntentId: paymentIntentId,
          },
      });
  
      return { sessionId: session.id, url: session.url };
  }
  
  async handleWebhook(body: any, sig: string) {
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

    let event;
    try {
        event = this.stripe.webhooks.constructEvent(body, sig, endpointSecret);
    } catch (err) {
        throw new Error('Webhook signature verification failed');
    }

    return event;
  }

  async findRecordByPaymentIntent(paymentIntentId: string){
    const find = await this.prisma.payment.findFirst({
      where:{
        paymentIntentId
      },
      include:{
        User: true,
        OrderTicket: true
      }
    })
    return find;
  }

  async updatePaymentStatus(paymentId: string, status: string, receipt: string){
    const findRecord = await this.findRecordByPaymentIntent(paymentId)
    if(!findRecord){
      throw new NotFoundException('Record not found')
    }
    const updateStatus = await this.prisma.payment.update({
      where:{
        id: findRecord.id
      },
      data:{
        status
      }
    })
    if( status === PaymentStatus.SUCCEEDED){
        console.log(findRecord.id)
        await this.sendPaymentReceipt(receipt, findRecord.User.email)
        await this.orderTiketService.sendTicketDetails(findRecord.OrderTicket.eventId,findRecord.User.email,findRecord.OrderTicket.id)
    }
    return updateStatus
  }

  async sendPaymentReceipt(receipt: string, userEmail:string){
    await this.mailerService.sendMail({
        to: userEmail,
        subject:'Payment receipt',
        text: `click to get receipt: ${receipt}`
    })
  }
}
