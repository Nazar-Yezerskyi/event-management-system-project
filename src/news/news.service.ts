import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CompanyService } from 'src/company/company.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateNewsDto } from './dtos/create-news.dto';
import { UpdateNewsDto } from './dtos/update-news.dto';
import { NewsSubscriptionService } from 'src/news-subscription/news-subscription.service';
import e from 'express';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class NewsService {
    constructor(
        private prisma: PrismaService,
        private companyService: CompanyService,
        private newsSubscriptionService: NewsSubscriptionService,
        private mailerService: MailerService
    ){}

    async findAllCompanyNews(companyId: number){
        const findCompany = await this.companyService.getCompanyInfo(companyId)
        if(!findCompany){
            throw new NotFoundException('Company not found')
        }
        const news = await this.prisma.news.findMany({
            where:{
                companyId
            }
        })
        return news;
    }

    async findOne(id: number){
        const findOne = await this.prisma.news.findUnique({
            where:{
                id
            }
        })
        return findOne
    }
    
    async createNews(newsData: CreateNewsDto, userId: number){
        const findCompany = await this.companyService.findCompanyByUser(userId)
        if(!findCompany){
            throw new NotFoundException('Company not found')
        }
        const createNews = await this.prisma.news.create({
            data:{
                title: newsData.title,
                content: newsData.content,
                newsImg: newsData.newsImg,
                companyId: findCompany.id
            }
        })
        const sendEmailTo = await this.newsSubscriptionService.findNewsSubscribers(findCompany.id)
        const emails = sendEmailTo.map((emails) => emails.Users.email);
        if(emails.length > 0){
            await this.mailerService.sendMail({
                to: emails,
                subject: `New news from ${findCompany.name}: ${newsData.title}`,
                text: `Check out the latest news:\n\n${newsData.content}`,
            })
        }
        return createNews;
    }

    async updateNews(updatedData: UpdateNewsDto, userId: number,newsId: number){
        const findNews = await this.findOne(newsId);
        if(!findNews){
            throw new BadRequestException('News not found')
        }
        const findCompany = await this.companyService.findCompanyByUser(userId)
        if(findNews.companyId !== findCompany.id){
            throw new ForbiddenException('You can only update your news')
        }

        const updatedNews = await this.prisma.news.update({
            where:{
                id: newsId
            },
            data:{
                title: updatedData.title,
                content: updatedData.content,
                newsImg: updatedData.newsImg
            }
        })
        return updatedNews
    }

    async deleteNews(newsId: number, userId: number){
        const findNews = await this.findOne(newsId);
        if(!findNews){
            throw new BadRequestException('News not found')
        }
        const findCompany = await this.companyService.findCompanyByUser(userId)
        if(findNews.companyId !== findCompany.id){
            throw new ForbiddenException('You can only delete your news')
        }
        const deletedNews = await this.prisma.news.delete({
            where: {
                id: newsId
            }
        })
        return deletedNews
    }
}
