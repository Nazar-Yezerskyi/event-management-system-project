import { Module, forwardRef } from '@nestjs/common';
import { OrderTicketController } from './order-ticket.controller';
import { OrderTicketService } from './order-ticket.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';
import { EventsModule } from 'src/events/events.module';
import { OrderPlacesModule } from 'src/order-places/order-places.module';
import { PromoCodesModule } from 'src/promo-codes/promo-codes.module';
import { PaymentModule } from 'src/payment/payment.module';

@Module({
  imports: [PrismaModule,JwtModule,EventsModule, OrderPlacesModule,PromoCodesModule, forwardRef(() => PaymentModule )],
  controllers: [OrderTicketController],
  providers: [OrderTicketService],
  exports: [OrderTicketService]
})
export class OrderTicketModule {}
