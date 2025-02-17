import { Module, forwardRef } from '@nestjs/common';
import { SurveyController } from './survey.controller';
import { SurveyService } from './survey.service';
import { SurveyOptionsModule } from 'src/survey-options/survey-options.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { CompanyModule } from 'src/company/company.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [PrismaModule,CompanyModule, forwardRef(() =>SurveyOptionsModule) , JwtModule],
  controllers: [SurveyController],
  providers: [SurveyService],
  exports: [SurveyService]
})
export class SurveyModule {}
