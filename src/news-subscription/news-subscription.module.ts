import { Module } from '@nestjs/common';
import { NewsSubscriptionController } from './news-subscription.controller';
import { NewsSubscriptionService } from './news-subscription.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UserModule } from 'src/user/user.module';
import { CompanyModule } from 'src/company/company.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports:[PrismaModule,UserModule,CompanyModule,JwtModule],
  controllers: [NewsSubscriptionController],
  providers: [NewsSubscriptionService],
  exports:[NewsSubscriptionService]
})
export class NewsSubscriptionModule {}
