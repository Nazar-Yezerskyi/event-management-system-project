import { Controller, Param, Post, UseGuards,Request, Delete} from '@nestjs/common';
import { SurveyResponseService } from './survey-response.service';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';

@Controller('survey-response')
export class SurveyResponseController {
   constructor( private surveyResponseService: SurveyResponseService){}

   @Post(':surveyId/:surveyOptionsId')
   @UseGuards(JwtAuthGuard)
   async addVote(@Param('surveyId') surveyId: string, @Param('surveyOptionsId') surveyOptionsId: string, @Request() req){
    const userId = req.user.userId
    const addVote = await this.surveyResponseService.addVote(+surveyId,+surveyOptionsId,userId)
    return addVote
   }
   @Delete(':surveyId')
   @UseGuards(JwtAuthGuard)
   async deleteVote(@Param('surveyId') surveyId: string, @Request() req){
    const userId = req.user.userId
    const addVote = await this.surveyResponseService.deleteVote(+surveyId,userId)
    return addVote
   }

}