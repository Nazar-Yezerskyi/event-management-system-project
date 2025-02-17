import { ForbiddenException, Inject, Injectable, NotFoundException, forwardRef } from '@nestjs/common';
import { CompanyService } from 'src/company/company.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { SurveyService } from 'src/survey/survey.service';

@Injectable()
export class SurveyOptionsService {
    constructor(
        private prisma:PrismaService,
        @Inject(forwardRef(()=> SurveyService))
        private surveyService: SurveyService,
        private companyService: CompanyService
    ){}

    async findRecord(optionsId: number, surveyId: number){
        const findRecord = await this.prisma.surveyOptions.findFirst({
            where:{
                id: optionsId,
                surveyId,
            },
            include:{
                Survey: true
            }
        })
        return findRecord;
    }

    async addOption(option: string, surveyId:number, userId: number){
        const findCompany = await this.companyService.findCompanyByUser(userId)
        if(!findCompany){
            throw new ForbiddenException('You cannot add option')
        }
        const findSurvey = await this.surveyService.findRecord(surveyId)
        if(!findSurvey){
            throw NotFoundException
        }

        const createdOptions = await this.prisma.surveyOptions.create({
            data:{
                text: option,
                surveyId
            }
        })
        return createdOptions
    }

    async addOptions(options: string[], surveyId: number){
        const addedOptions = options.map((options => ({text: options, surveyId})))
        const createdOptions = await this.prisma.surveyOptions.createMany({
            data: addedOptions
        })
        return createdOptions
    }
    
    async updateOption(optionsId: number, surveyId: number,text: string, userId: number){
        const findSurvey = await this.surveyService.findRecord(surveyId)
        if(!findSurvey){
            throw NotFoundException
        }
        const findRecord = await this.findRecord(optionsId,surveyId)
        if(findRecord.Survey.createdByCompanyId !== userId){
            throw new ForbiddenException('You cannot update')
        }
        if(!findRecord){
            throw new NotFoundException('Record not found')
        }
        const updatedOptions = await this.prisma.surveyOptions.update({
            where:{
                id: optionsId
            },
            data:{
                text
            }
        })
        return updatedOptions
    }

    async deleteOption(optionsId: number, surveyId: number, userId: number){
        const findSurvey = await this.surveyService.findRecord(surveyId)
        if(!findSurvey){
            throw NotFoundException
        }
        const findRecord = await this.findRecord(optionsId,surveyId)
        if(findRecord.Survey.createdByCompanyId !== userId){
            throw new ForbiddenException('You cannot update')
        }
        if(!findRecord){
            throw new NotFoundException('Record not found')
        }

        const deletedOption = await this.prisma.surveyOptions.delete({
            where:{
                id: optionsId
            },
            include:{
                surveyResponses: true
            }
        })
        return deletedOption
    }
}
