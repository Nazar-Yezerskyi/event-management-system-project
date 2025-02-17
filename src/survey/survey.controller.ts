import { Controller, Post, UseGuards,Request, Body, Param, Query, Put, Delete, Get } from '@nestjs/common';
import { SurveyService } from './survey.service';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { CreateSurveyDto } from './dtos/create-survey.dto';
import { UpdateSurveyDto } from './dtos/update-survey.dto';

@Controller('survey')
export class SurveyController {
    constructor(private surveyService: SurveyService){}

    @Post()
    @UseGuards(JwtAuthGuard)
    async createSurvey(@Body() surveyData: CreateSurveyDto,@Query('options') options: string,@Request() req){
        const userId = req.user.userId;
        const createdSurvey = await this.surveyService.createSurvey(surveyData,userId,options)
        return createdSurvey
    }
    
    @Put(':surveyId')
    @UseGuards(JwtAuthGuard)
    async updateSurvey(@Param('surveyId') surveyId: string, @Body() updatedData: UpdateSurveyDto, @Request() req){
        const userId = req.user.userId
        const updatedSurvey = await this.surveyService.updateSurvey(+surveyId,userId,updatedData)
        return updatedSurvey
    }

    @Delete(':surveyId')
    @UseGuards(JwtAuthGuard)
    async deleteSurvey(@Param('surveyId') surveyId: string, @Request()req){
        const userId =  req.user.userId
        const deletedSurvey = await this.surveyService.deleteSurvey(+surveyId,userId)
        return deletedSurvey;
    }

    @Get(':surveyId')
    @UseGuards(JwtAuthGuard)
    async getSurveyResults(@Param('surveyId') surveyId: string){
        const getSurveyResults = await this.surveyService.getSurveyResults(+surveyId)
        return getSurveyResults
    }
}
