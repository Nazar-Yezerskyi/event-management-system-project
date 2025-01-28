import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';
import { RoleModule } from './role/role.module';
import { CompanyModule } from './company/company.module';
import { CategoryModule } from './category/category.module';
import { CompanyCategoriesModule } from './company-categories/company-categories.module';
import { UserCategoriesModule } from './user-categories/user-categories.module';
import { RequestsModule } from './requests/requests.module';
import { EventsModule } from './events/events.module';
import { TypeOfEventsActivityModule } from './type-of-events-activity/type-of-events-activity.module';
import { EventsTypeModule } from './events-type/events-type.module';
import { NewsModule } from './news/news.module';
import { NewsSubscriptionModule } from './news-subscription/news-subscription.module';
import { PromoCodesModule } from './promo-codes/promo-codes.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true}),
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        transport: {
          host: configService.get<string>('MAIL_HOST'),
          port: configService.get<number>('MAIL_PORT'),
          secure: false,
          auth: {
            user: configService.get<string>('MAIL_USER'),
            pass: configService.get<string>('MAIL_PASS'),
          },
        },
        defaults: {
          from: configService.get<string>('MAIL_FROM'),
        },
      }),
    }),
    PrismaModule, UserModule, AuthModule, RoleModule, CompanyModule, CategoryModule, CompanyCategoriesModule, UserCategoriesModule, RequestsModule],
    PrismaModule, UserModule, AuthModule, RoleModule, CompanyModule, CategoryModule, CompanyCategoriesModule, UserCategoriesModule, EventsModule, TypeOfEventsActivityModule, EventsTypeModule, NewsModule, NewsSubscriptionModule, PromoCodesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
