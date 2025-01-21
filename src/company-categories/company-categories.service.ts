import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CategoryService } from 'src/category/category.service';
import { CompanyService } from 'src/company/company.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CompanyCategoriesService {
    constructor(
        private prisma: PrismaService,
        private companyService: CompanyService,
        private categoryService: CategoryService
        ){}


    async addCategoryToCompany(companyId: number, categoryId: number, userId: number){
        const findCompany = await this.companyService.getCompanyInfo(companyId)
        if(!findCompany){
            throw new NotFoundException('Company not found')
        }
        if(findCompany.userId !== userId){
            throw new ForbiddenException('You can only add category to your company')
        }
        const findCategory = await this.categoryService.findOneCategory(categoryId)
        if(!findCategory){
            throw new NotFoundException('Category not found')
        }
        const addedCategoryToCompany = await this.prisma.companiesCategories.create({
            data:{
                categoryId,
                companyId
            }
        })
        return addedCategoryToCompany;
    }
    async getAllCompanyCategories(companyId: number){
        const categories = await this.prisma.companiesCategories.findMany({
            where:{
                companyId
            },
            include:{
                Categories: true
            }
        })
        return categories
    }
    private async findCompanyCategory(companyId: number, categoryId: number){
        const findCompanyCategory = await this.prisma.companiesCategories.findFirst({
            where:{
                categoryId,
                companyId
            },
            include:{
                Companies:{
                    include:{
                        CompaniesCategories: true
                    }
                }
            }
        })
        return findCompanyCategory
    }

    async deleteCompanyCategory(companyId: number, categoryId: number, userId: number){
        const findCompanyCategory = await this.findCompanyCategory(companyId,categoryId)
        if(!findCompanyCategory){
            throw new NotFoundException('Record not found')
        }
        if(findCompanyCategory.Companies.userId !== userId){
            throw new ForbiddenException('You can edit only your company')
        }
        const deletedCompanyCategory = this.prisma.companiesCategories.delete({
            where:{
                id: findCompanyCategory.id
            }
        })

        return deletedCompanyCategory;
    }
}
