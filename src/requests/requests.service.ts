import { BadRequestException, Inject, Injectable, NotFoundException, forwardRef } from '@nestjs/common';
import { CategoryService } from 'src/category/category.service';
import { CompanyService } from 'src/company/company.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from 'src/user/user.service';
import { RequestsStatus } from 'src/enums/requests-status.enum';
import { RequestsType } from 'src/enums/requests-type.enum';
import { MailerService } from '@nestjs-modules/mailer';
import { RequestsEmailStatus } from 'src/enums/request-email-status.enum';

@Injectable()
export class RequestsService {
    constructor(
        private prisma: PrismaService,
        private categoryService: CategoryService,
        private userService: UserService,
        private mailerService: MailerService,
        @Inject(forwardRef(() => CompanyService))
        private companyService: CompanyService
    ){}

    async findRecord(id: number){
        const findRecord = await this.prisma.requests.findUnique({
            where:{
                id
            },
            include:{
                createdBy:true
            }
        })
        return findRecord;
    }

    async findUsersRequests(userId: number){
        const findRecord = await this.prisma.requests.findMany({
            where:{
                createdById: userId
            },
        })
        if(!findRecord){
            throw new NotFoundException('Requests not found')
        }
        return findRecord
    }

    async findRequests(status: string){
        if (!Object.values(RequestsStatus).includes(status as RequestsStatus)) {
            throw new BadRequestException('Invalid status value');
        }
        const findRequests = await this.prisma.requests.findMany({
            where:{
                status
            }
        })
        return findRequests
    }

    async createRequest(data:object,description: string,userId: number, type: string){
        const findCompany = await this.companyService.findCompanyByUser(userId)
        if(!findCompany){
            throw new NotFoundException('Company not found')
        }
        const createRequest = await this.prisma.requests.create({
            data:{
                data,
                description,
                createdById: userId,
                type,
                companyId: findCompany.id
            }
        })
        return createRequest
    }

    async verifyRequest(requestId: number, userId: number, status: string) {
        const user = await this.userService.findOneUser(userId);
        if (!user) {
            throw new NotFoundException('User not found');
        }
        if (!Object.values(RequestsStatus).includes(status as RequestsStatus)) {
            throw new BadRequestException('Invalid status value');
        }
        const record = await this.findRecord(requestId);
        if (!record) {
            throw new NotFoundException('Record not found');
        }

        const updatedRequest = await this.prisma.requests.update({
            where: { 
                id: record.id 
            },
            data: {
                status,
                reviewdById: userId,
                reviewdAt: new Date(),
            },
        });
    
        if (record.type === RequestsType.ADDCATEGORY) {
            const requestData = record.data as { name: string };
            if (!requestData?.name) {
                throw new BadRequestException('Field "name" is missing in request data');
            }
    
            const existingCategory = await this.categoryService.findByTitle(requestData.name);
            if (!existingCategory) {
                if (status === RequestsStatus.APPROVED) {
                    const newCategory = await this.categoryService.createCategory(requestData.name);
                    await this.sendMail(user.email, RequestsEmailStatus.APPROVED, `Category: ${requestData.name} added`);
                    return { updatedRequest, newCategory };
                } else {
                    await this.sendMail(user.email, RequestsEmailStatus.REJECTED, `Category: ${requestData.name} not added`);
                    return { updatedRequest };
                }
            }
    
            await this.sendMail(user.email, RequestsEmailStatus.REJECTED, `Category: ${requestData.name} already exists`);
            return existingCategory;
        }
    
        if (record.type === RequestsType.VERIFYCOMPANY) {
            const company = await this.companyService.findCompany(record.companyId);
            if (!company) {
                throw new NotFoundException('Company not found');
            }
    
            if (status === RequestsStatus.APPROVED) {
                const verifiedCompany = await this.companyService.verifiedCompany(record.companyId);
                await this.sendMail(user.email, RequestsEmailStatus.APPROVED, `Company: ${company.name} verified`);
                return { updatedRequest, verifiedCompany };
            }
    
            await this.sendMail(user.email, RequestsEmailStatus.REJECTED, `Company: ${company.name} not verified`);
            return { updatedRequest };
        }
    
        throw new BadRequestException('Unsupported request type');
    }

    private async sendMail(to: string, subject: string, text: string) {
        await this.mailerService.sendMail({ to, subject, text });
    }
}
