import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { SurveyOptionsService } from 'src/survey-options/survey-options.service';
import { SurveyService } from 'src/survey/survey.service';

@Injectable()
export class SurveyResponseService {
    constructor(
        private prisma: PrismaService,
        private surveyService: SurveyService,
        private surveyOptionsService: SurveyOptionsService 
    ){}

    async findRecord(surveyId: number, userId: number){
        const findRecord = await this.prisma.surveyResponses.findFirst({
            where:{
                surveyId,
                userId
            }
        })
        return findRecord
    }

    async addVote(surveyId: number, surveyOptionsId: number, userId: number){
        const findSurvey = await this.surveyService.findRecord(surveyId)
        if(!findSurvey){
            throw new NotFoundException('Survey not found')
        }
        const findSurveyOptions = await this.surveyOptionsService.findRecord(surveyOptionsId,surveyId)
        if(!findSurveyOptions){
            throw new NotFoundException('Survey option not found')
        }
        const findRecord = await this.findRecord(surveyId,userId)
        if(findRecord){
            throw new ForbiddenException('You have already voted')
        }
        const addVote = await this.prisma.surveyResponses.create({
            data:{
                surveyId,
                surveyOptionsId,
                userId
            }
        })
        return addVote
    }

    async deleteVote(surveyId: number, userId: number){
        const findSurvey = await this.surveyService.findRecord(surveyId)
        if(!findSurvey){
            throw new NotFoundException('Survey not found')
        }
        const findRecord = await this.findRecord(surveyId,userId)
        if(!findRecord){
            throw new NotFoundException('Record not found')
        }
        const deleteVote = await this.prisma.surveyResponses.delete({
            where:{
                id: findRecord.id
            }
        })
        return deleteVote
    }
}
