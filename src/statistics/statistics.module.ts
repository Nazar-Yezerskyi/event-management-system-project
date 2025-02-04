import { Module } from '@nestjs/common';
import { StatisticsController } from './statistics.controller';
import { StatisticsService } from './statistics.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';
import { CompanyModule } from 'src/company/company.module';
import { EventsModule } from 'src/events/events.module';
import { PromoCodesModule } from 'src/promo-codes/promo-codes.module';
import { OrderTicketModule } from 'src/order-ticket/order-ticket.module';

@Module({
  imports:[PrismaModule,JwtModule, CompanyModule,EventsModule, OrderTicketModule,PromoCodesModule],
  controllers: [StatisticsController],
  providers: [StatisticsService]
})
export class StatisticsModule {}
