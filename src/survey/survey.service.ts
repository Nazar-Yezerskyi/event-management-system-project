import { ForbiddenException, Inject, Injectable, NotFoundException, forwardRef } from '@nestjs/common';
import { CompanyService } from 'src/company/company.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { SurveyOptionsService } from 'src/survey-options/survey-options.service';
import { CreateSurveyDto } from './dtos/create-survey.dto';
import { UpdateSurveyDto } from './dtos/update-survey.dto';

@Injectable()
export class SurveyService {
    constructor(
        private prisma: PrismaService,
        private companyService: CompanyService,
        @Inject(forwardRef(()=> SurveyOptionsService))
        private surveyOptionsService: SurveyOptionsService
    ){}

    async findRecord(id: number){
        const findRecord = await this.prisma.survey.findUnique({
            where:{
                id
            }
        })
        return findRecord
    }

    async createSurvey(surveyData: CreateSurveyDto, userId: number, options: string){
        const findCompany = await this.companyService.findCompanyByUser(userId)
        if(!findCompany){
            throw new ForbiddenException('You cannot create a survey')
        }
        let showStatus: boolean
        if(surveyData.showResult){
            showStatus = surveyData.showResult === 'true'
        }
        const createdSurvey = await this.prisma.survey.create({
            data:{
                ...surveyData,
                createdByCompanyId: findCompany.id,
                showResult: showStatus
            }
        })
        const optionsArr = options.split(',')
        await this.surveyOptionsService.addOptions(optionsArr,createdSurvey.id)
        return {createdSurvey,optionsArr}
    }

    async updateSurvey(surveyId: number,userId:number, updatedData: UpdateSurveyDto){
        const findCompany = await this.companyService.findCompanyByUser(userId)
        if(!findCompany){
            throw new ForbiddenException('You cannot delete a survey')
        }
        const findRecord = await this.findRecord(surveyId)
        if(!findRecord){
            throw new NotFoundException('Record not found')
        }
        let showStatus: boolean
        if(updatedData.showResult){
            showStatus = updatedData.showResult === 'true'
        }
        const updatedSurvey = await this.prisma.survey.update({
            where:{
                id: surveyId
            },
            data:{
                ...updatedData,
                showResult: showStatus
            }
        })
        return updatedSurvey
    }

    async deleteSurvey(surveyId: number, userId:number){
        const findCompany = await this.companyService.findCompanyByUser(userId)
        if(!findCompany){
            throw new ForbiddenException('You cannot delete a survey')
        }
        const findRecord = await this.findRecord(surveyId)
        if(!findRecord){
            throw new NotFoundException('Record not found')
        }

        const deletedSurvey = await this.prisma.survey.delete({
            where:{
                id: surveyId
            }, 
            include:{
                surveyOptions: true,
                surveyResponses: true
            }
        })
        return deletedSurvey
    }

    async findSurvey(surveyId: number){
        const survey = await this.prisma.survey.findUnique({
            where: { id: surveyId },
            select: { showResult: true }
        });
        return survey;
    }
    async getSurveyResults(surveyId: number) {
        const survey = await this.findSurvey(surveyId);
        if (!survey) {
            throw new NotFoundException('Survey not found');
        }
    
        if (!survey.showResult) {
            throw new ForbiddenException('Results hidden');
        }
    
        const optionsWithVotes = await this.prisma.surveyOptions.findMany({
            where: { surveyId },
            select: {
                id: true,
                text: true,
                _count: {
                    select: { surveyResponses: true }
                }
            }
        });
    
        const totalResponses = optionsWithVotes.reduce((sum, option) => sum + option._count.surveyResponses, 0);
    
        const results = optionsWithVotes.map(option => ({
            optionId: option.id,
            text: option.text,
            votes: option._count.surveyResponses,
            percentage: totalResponses > 0 ? ((option._count.surveyResponses / totalResponses) * 100).toFixed(2) + "%" : "0%"
        }));
    
        return results;
    }
}
