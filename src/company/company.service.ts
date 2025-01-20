import { ForbiddenException, Injectable, NotFoundException, Query } from '@nestjs/common';
import { CreateCompanyDto } from './dtos/create-company.dto';
import { UpdateCompanyDto } from './dtos/update-company.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { MailerService } from '@nestjs-modules/mailer';


@Injectable()
export class CompanyService {
    constructor(
        private prisma: PrismaService,
        private mailerService: MailerService
    ){}

    async findCompanyByCategories(categories: string[]){
        const companies = await this.prisma.companies.findMany({
            where:{
                CompaniesCategories:{
                    some:{
                        Categories:{
                            name:{
                                in: categories
                            }
                        }
                    }
                }
            }
        })
        if(companies.length === 0){
            throw new NotFoundException('Companies with this categories not found')
        }
        return companies
    }
    
    async getCompanyInfo(id: number){
        const company = await this.prisma.companies.findUnique({
            where:{
                id,
                isVerified: true
            },
            include:{
                CompaniesCategories:{
                    include:{
                        Categories: true
                    } 
                },
            }
        })
        return company
    }
    private async findOne(id: number){
        const company = await this.prisma.companies.findUnique({
            where:{
                id,
                isVerified: true
            }
        })
        return company
    }

    async searchCompany(name?: string, country?: string, city?: string){
        const company = await this.prisma.companies.findMany({
            where:{
                AND:[
                    name
                    ? {
                        name: {
                            contains: name,
                            mode: 'insensitive',
                        },
                    }: {},
                    country
                    ? {
                        country: {
                            contains: country,
                            mode: 'insensitive',
                        },
                    }: {},
                    city
                    ? {
                        city: {
                            contains: city,
                            mode: 'insensitive',
                        },
                    }: {},
                ]
            },
            include:{
                CompaniesCategories:{
                    include:{
                        Categories: true
                    } 
                },
            }
        })
        return company
    }

    async createCompany(companyData: CreateCompanyDto, userId: number){
        const createCompany = await this.prisma.companies.create({
            data:{
                name: companyData.name,
                email: companyData.email,
                country: companyData.country,
                city: companyData.city,
                street: companyData.street,
                userId
            }
        })
        return createCompany
    }

    async getAllNotVerifiedCompanies(){
        const companies = await this.prisma.companies.findMany({
            where:{
                isVerified: false
            }
        })
        return companies
    }

    async verifiedCompany(id: number){
        const findCompany = await this.findOne(id)
        if(!findCompany){
            throw new NotFoundException('Company not found')
        }
        const verified = await this.prisma.companies.update({
            where:{
                id
            },
            data:{
                isVerified: true
            }
        })

        await this.mailerService.sendMail({
            to: findCompany.email,
            subject: 'Your company verified',
            text: `Hello ${findCompany.name},\n\nYour company is verified.`,
          });

        return verified
    }

    async updateCompany(companyData: UpdateCompanyDto, id: number, userId: number){
        const findCompany = await this.getCompanyInfo(id)
        if(!findCompany){
            throw new NotFoundException('Company not found')
        }
        if(findCompany.userId !== userId){
            throw new ForbiddenException('You can update only your company')
        }

        const updatedCompany = this.prisma.companies.update({
            where:{
                id
            },
            data:{
                name: companyData.name,
                city: companyData.city,
                country: companyData.country,
                street: companyData.street,
                email: companyData.email
            }
        })
        return updatedCompany;
    }

    async deleteCompany(companyId: number, userId: number){
        const findCompany = await this.getCompanyInfo(companyId)
        if(!findCompany){
            throw new NotFoundException('Company not found')
        }
        if(findCompany.userId !== userId){
            throw new ForbiddenException('You can delete only your company')
        }
        const deletedCompany = await this.prisma.companies.delete({
            where:{
                id: companyId
            }
        })
        return deletedCompany
    }
}
