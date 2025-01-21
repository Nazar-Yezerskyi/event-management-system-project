import { Body, Controller, Delete, Get, Param, Post, Put, Query, Request, UseGuards } from '@nestjs/common';
import { CompanyService } from './company.service';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { CreateCompanyDto } from './dtos/create-company.dto';
import { AdminGuard } from 'src/guards/admin.guard';
import { UpdateCompanyDto } from './dtos/update-company.dto';

@Controller('company')
export class CompanyController {
    constructor(private companyService: CompanyService){}

    @Get('search')
    async searchCompany(@Query('name') name?: string, @Query('country') country?: string, @Query('city') city?: string ){
        const search = await this.companyService.searchCompany(name, country, city)
        return search
    }

    @Get('by-categories')
    async getCompanyByCategories(@Query('categories') categories: string){
        const categoriesArr = categories.split(',')
        const getCompany = await this.companyService.findCompanyByCategories(categoriesArr)
        return getCompany;
    }

    @Post()
    @UseGuards(JwtAuthGuard)
    async createCompany(@Body() body: CreateCompanyDto, @Request() req ){
        const userId = req.user.userId;
        const createCompany = await this.companyService.createCompany(body, userId);
        return createCompany
    }

    @Put(':id')
    @UseGuards(AdminGuard)
    async verifyCompany(@Param('id') id: string){
        const verifiedCompany = await this.companyService.verifiedCompany(+id)
        return verifiedCompany;
    }

    @Put('update-company/:id')
    @UseGuards(JwtAuthGuard)
    async updateCompany(@Param('id') id: string,@Body() body: UpdateCompanyDto, @Request() req){
        const userId = req.user.userId;
        const updatedCompany = await this.companyService.updateCompany(body,+id,userId)
        return updatedCompany;
    }

    @Get('not-verified')
    @UseGuards(AdminGuard)
    async getAllNotVerifiedCompanies(){
        const companies = this.companyService.getAllNotVerifiedCompanies();
        return companies;
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    async deleteCompany(@Param('id') id: string, @Request() req){
        const userId = req.user.userId;
        const deletedCompany = await this.companyService.deleteCompany(+id,userId)
        return deletedCompany;
    }
}
