import { Module } from '@nestjs/common';
import { NewsController } from './news.controller';
import { NewsService } from './news.service';
import { JwtModule } from '@nestjs/jwt';
import { CompanyModule } from 'src/company/company.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { NewsSubscriptionModule } from 'src/news-subscription/news-subscription.module';

@Module({
  imports:[PrismaModule,JwtModule, CompanyModule, NewsSubscriptionModule],
  controllers: [NewsController],
  providers: [NewsService],
  exports:[NewsService]
})
export class NewsModule {}
