import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CompanyService } from 'src/company/company.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from 'src/user/user.service';

@Injectable()
export class NewsSubscriptionService {
    constructor(
        private prisma: PrismaService,
        private userService: UserService,
        private companyService:CompanyService
    ){}
    
    private async findRecord(userId: number, companyId: number){
        const findRecord = await this.prisma.newsSubscription.findFirst({
            where:{
                userId,
                companyId
            }
        })
        return findRecord
    }

    async findAllSubscription(userId: number){
        const findAllSubscription = await this.prisma.newsSubscription.findMany({
            where:{
                userId
            }
        })
        return findAllSubscription
    }

    async findNewsSubscribers(companyId: number){
        const findNewsSubscribers = await this.prisma.newsSubscription.findMany({
            where:{
                companyId,
                getEmail: true
            },
            select:{
                Users:{
                    select:{
                        email: true
                    }
                }
            }
        })
        return findNewsSubscribers
    }

    async subscribeToNews(userId: number, companyId: number){
        const findRecord = await this.findRecord(userId,companyId)
        if(findRecord){
            throw new BadRequestException('Record already exists')
        }
        const findUser = await this.userService.findOneUser(userId)
        if(!findUser){
            throw new NotFoundException('User not found')
        }
        const findCompany = await this.companyService.getCompanyInfo(companyId)
        if(!findCompany){
            throw new NotFoundException('Company not found')
        }

        const subscribeToNews = await this.prisma.newsSubscription.create({
            data:{
                userId,
                companyId
            }
        })

        return subscribeToNews;
    }

    async unsubscribeNews(userId: number, companyId: number){
        const findRecord = await this.findRecord(userId, companyId)
        if(!findRecord){
            throw new NotFoundException('Record not found')
        }
        const findUser = await this.userService.findOneUser(userId)
        if(!findUser){
            throw new NotFoundException('User not found')
        }
        const findCompany = await this.companyService.getCompanyInfo(companyId)
        if(!findCompany){
            throw new NotFoundException('Company not found')
        }
        const unsubscribeNews = await this.prisma.newsSubscription.delete({
            where:{
                id: findRecord.id
            }
        })

        return unsubscribeNews;
    }

    async editMailing(userId: number, companyId: number,getEmail: string){
        const findRecord = await this.findRecord(userId, companyId)
        if(!findRecord){
            throw new NotFoundException('Record not found')
        }
        const mailing = getEmail === 'true'

        const editMailing = await this.prisma.newsSubscription.update({
            where:{
                id: findRecord.id
            },
            data:{
                getEmail: mailing
            }
        })
        return editMailing;
    }
}
