import { Module, forwardRef } from '@nestjs/common';
import { CompanyController } from './company.controller';
import { CompanyService } from './company.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from 'src/user/user.module';
import { RequestsModule } from 'src/requests/requests.module';

@Module({
  imports:[PrismaModule, JwtModule, UserModule, forwardRef(() => RequestsModule )],
  controllers: [CompanyController],
  providers: [CompanyService],
  exports:[CompanyService]
})
export class CompanyModule {}
