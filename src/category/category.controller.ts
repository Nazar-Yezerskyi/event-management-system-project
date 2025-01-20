import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { CategoryService } from './category.service';
import { AdminGuard } from 'src/guards/admin.guard';
import { CategoryDto } from './dtos/category.dto';

@Controller('category')
export class CategoryController {
    constructor(private categoryService: CategoryService){}

    @Get()
    async findAllCategories(){
        const categories = await this.categoryService.findAllCategories()
        return categories;
    }

    @Post()
    @UseGuards(AdminGuard)
    async createCategory(@Body() body: CategoryDto){
        const createCategory = await this.categoryService.createCategory(body.name)
        return createCategory;
    }

    @Put(':id')
    @UseGuards(AdminGuard)
    async updateCategory(@Body() body: CategoryDto, @Param('id') id: string){
        const updatedCategory = await this.categoryService.updateCategory(+id,body.name)
        return updatedCategory;
    }
    
    @Delete(':id')
    @UseGuards(AdminGuard)
    async deleteCategory(@Param('id') id: string){
        const deletedCategory = await this.categoryService.deleteCategory(+id)
        return deletedCategory;
    }

}
