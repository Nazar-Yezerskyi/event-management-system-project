import { Module, forwardRef } from '@nestjs/common';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UserModule } from 'src/user/user.module';
import { OrderTicketModule } from 'src/order-ticket/order-ticket.module';

@Module({
  imports: [PrismaModule, UserModule,forwardRef(() => OrderTicketModule)],
  controllers: [PaymentController],
  providers: [PaymentService],
  exports: [PaymentService]
})
export class PaymentModule {}
