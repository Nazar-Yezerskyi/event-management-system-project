import { Controller, Get, Param, UseGuards,Request, Query } from '@nestjs/common';
import { StatisticsService } from './statistics.service';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';

@Controller('statistics')
export class StatisticsController {
    constructor(private statisticService: StatisticsService){}

    @Get(':eventId')
    @UseGuards(JwtAuthGuard)
    async getStatisticByEvent(@Param('eventId') eventId: string, @Request() req: any){
        const userId = req.user.userId
        const statistic = await this.statisticService.getStatisticByEvent(+eventId, userId)
        return statistic
    }

    @Get('/by-company/:companyId')
    @UseGuards(JwtAuthGuard)
    async getStatisticByCompany(@Param('companyId') companyId: string, @Request() req: any, @Query('startDate') startDate?: string){
        const userId = req.user.userId
        const statistic = await this.statisticService.getStatisticByCompany(+companyId,userId, startDate)
        return statistic
    }
}
