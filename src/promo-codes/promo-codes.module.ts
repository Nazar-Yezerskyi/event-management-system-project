import { Module } from '@nestjs/common';
import { PromoCodesController } from './promo-codes.controller';
import { PromoCodesService } from './promo-codes.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { CompanyModule } from 'src/company/company.module';
import { EventsModule } from 'src/events/events.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [PrismaModule, CompanyModule, EventsModule, JwtModule],
  controllers: [PromoCodesController],
  providers: [PromoCodesService],
  exports: [PromoCodesService]
})
export class PromoCodesModule {}
