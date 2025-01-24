import { Body, Controller, Delete, Get, Param, Post, Put, Request, UseGuards } from '@nestjs/common';
import { NewsService } from './news.service';
import { CreateNewsDto } from './dtos/create-news.dto';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { UpdateNewsDto } from './dtos/update-news.dto';

@Controller('news')
export class NewsController {

    constructor(private newsService: NewsService){}

    @Get(':companyId')
    async findAllCompanyNews(@Param('companyId') companyId: string){
        const news = await this.newsService.findAllCompanyNews(+companyId)
        return news;
    }

    @Get(':newsId')
    async getNewsInfo(@Param('newsId') newsId: string){
        const news = await this.newsService.findOne(+newsId)
        return news;
    }

    @Post()
    @UseGuards(JwtAuthGuard)
    async createNews(@Body() newsData: CreateNewsDto, @Request() req){
        const userId = req.user.userId
        const createNews = await this.newsService.createNews(newsData,+userId)
        return createNews;
    }

    @Put(':newsId')
    @UseGuards(JwtAuthGuard)
    async updateNews(@Body() updatedData: UpdateNewsDto,@Param('newsId') newsId: string ,@Request() req){
        const userId = req.user.userId
        const updateNews = await this.newsService.updateNews(updatedData,userId,+newsId)
        return updateNews;
    }

    @Delete(':newsId')
    @UseGuards(JwtAuthGuard)
    async deleteNews(@Param('newsId') newsId: string ,@Request() req){
        const userId = req.user.userId
        const deleteNews = await this.newsService.deleteNews(+newsId,userId)
        return deleteNews;
    }
}
