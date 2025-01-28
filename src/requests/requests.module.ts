import { Module, forwardRef } from '@nestjs/common';
import { RequestsController } from './requests.controller';
import { RequestsService } from './requests.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';
import { CompanyModule } from 'src/company/company.module';
import { CategoryModule } from 'src/category/category.module';
import { UserModule } from 'src/user/user.module';

@Module({
  imports:[PrismaModule, JwtModule,forwardRef(() =>CompanyModule),CategoryModule, UserModule ],
  controllers: [RequestsController],
  providers: [RequestsService],
  exports: [RequestsService]
})
export class RequestsModule {}
