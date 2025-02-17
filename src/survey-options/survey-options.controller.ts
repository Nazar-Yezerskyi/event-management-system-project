import { Body, Controller, Param, Post, UseGuards,Request, Put, Delete } from '@nestjs/common';
import { SurveyOptionsService } from './survey-options.service';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { AddAndUpdateOptionsDto } from './dtos/add-options.dto';

@Controller('survey-options')
export class SurveyOptionsController {
    constructor(private surveyOptionsService: SurveyOptionsService){}

    @Post(':surveyId')
    @UseGuards(JwtAuthGuard)
    async addOption(@Param('surveyId')surveyId: string, @Body() body: AddAndUpdateOptionsDto, @Request() req){
        const userId = req.user.userId
        const addOption = await this.surveyOptionsService.addOption(body.option,+surveyId,userId)
        return addOption
    }

    @Put(':optionsId/:surveyId')
    @UseGuards(JwtAuthGuard)
    async updateOption(@Param('optionsId') optionsId: string,@Param('surveyId') surveyId: string, @Body() body: AddAndUpdateOptionsDto, @Request() req){
        const userId = req.user.userId
        const updateOption = await this.surveyOptionsService.updateOption(+optionsId,+surveyId,body.option,userId)
        return updateOption
    }

    @Delete(':optionsId/:surveyId')
    async deleteOption(@Param('optionsId') optionsId: string,@Param('surveyId') surveyId: string,@Request() req){
        const userId = req.user.userId
        const deletedOption = await this.surveyOptionsService.deleteOption(+optionsId,+surveyId,userId)
        return deletedOption
    }
}
