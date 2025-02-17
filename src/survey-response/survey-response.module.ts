import { Module } from '@nestjs/common';
import { SurveyResponseController } from './survey-response.controller';
import { SurveyResponseService } from './survey-response.service';
import { SurveyOptionsModule } from 'src/survey-options/survey-options.module';
import { SurveyModule } from 'src/survey/survey.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports:[PrismaModule,SurveyOptionsModule, SurveyModule,JwtModule ],
  controllers: [SurveyResponseController],
  providers: [SurveyResponseService]
})
export class SurveyResponseModule {}
