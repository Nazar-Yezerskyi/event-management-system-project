import { Body, Controller, Delete, Get, Param, Post, Request, UseGuards } from '@nestjs/common';
import { CompanyCategoriesService } from './company-categories.service';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { AddCategoryToCompanyDto } from './dtos/add-category-to-company.dto';

@Controller('company-categories')
export class CompanyCategoriesController {
    constructor(private companyCategoriesService: CompanyCategoriesService){}

    @Get(':id')
    async getAllCompanyCategories(@Param('id') id: string){
        const categories = await this.companyCategoriesService.getAllCompanyCategories(+id)
        return categories
    }

    @Post()
    @UseGuards(JwtAuthGuard)
    async addCategoryToCompany(@Body() body: AddCategoryToCompanyDto, @Request() req){
        const userId = req.user.userId;
        const addedCategory = await this.companyCategoriesService.addCategoryToCompany(body.companyId,body.categoryId,userId)
        return addedCategory;
    }

    @Delete(':companyId/:categoryId')
    @UseGuards(JwtAuthGuard)
    async deleteCompanyCategory(@Param('companyId') companyId: string, @Param('categoryId') categoryId: string,@Request() req){
        const userId = req.user.userId;
        const deleted = await this.companyCategoriesService.deleteCompanyCategory(+companyId,+categoryId,userId)
        return deleted
    }
}
