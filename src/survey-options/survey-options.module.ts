import { Module, forwardRef } from '@nestjs/common';
import { SurveyOptionsController } from './survey-options.controller';
import { SurveyOptionsService } from './survey-options.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';
import { SurveyModule } from 'src/survey/survey.module';
import { CompanyModule } from 'src/company/company.module';

@Module({
  imports: [PrismaModule,JwtModule, forwardRef(() => SurveyModule), CompanyModule],
  controllers: [SurveyOptionsController],
  providers: [SurveyOptionsService],
  exports: [SurveyOptionsService]
})
export class SurveyOptionsModule {}
