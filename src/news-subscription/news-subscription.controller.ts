import { Controller, Delete, Param, Post, Put, Query, Request, UseGuards } from '@nestjs/common';
import { NewsSubscriptionService } from './news-subscription.service';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';

@Controller('news-subscription')
export class NewsSubscriptionController {
    constructor( private newsSubscriptionService: NewsSubscriptionService){}

    @Post(':companyId')
    @UseGuards(JwtAuthGuard)
    async subscribeToNews(@Param('companyId') companyId: string, @Request() req){
        const userId = req.user.userId
        const subscribe = await this.newsSubscriptionService.subscribeToNews(userId,+companyId)
        return subscribe;
    }

    @Put(':companyId')
    @UseGuards(JwtAuthGuard)
    async editMailing(@Query('getEmail') getEmail: string, @Param('companyId') companyId: string, @Request() req){
        const userId = req.user.userId
        const editMailing = await this.newsSubscriptionService.editMailing(userId,+companyId,getEmail)
        return editMailing;
    }

    @Delete(':companyId')
    @UseGuards(JwtAuthGuard)
    async unsubscribeNews(@Param('companyId') companyId: string, @Request() req){
        const userId = req.user.userId
        const unsubscribeNews = await this.newsSubscriptionService.unsubscribeNews(userId,+companyId)
        return unsubscribeNews;
    }
}
