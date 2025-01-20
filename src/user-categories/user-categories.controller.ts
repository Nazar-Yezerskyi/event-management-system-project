import { Controller, Delete, Get, Param, Post, Request, UseGuards } from '@nestjs/common';
import { UserCategoriesService } from './user-categories.service';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';

@Controller('user-categories')
export class UserCategoriesController {
    constructor(private userCategoriesService: UserCategoriesService){}

    @Get(':id')
    async getUserCategories(@Param('id') id: string){
        const categories = await this.userCategoriesService.getAllUserCategories(+id)
        return categories
    }

    @Post(':categoryId')
    @UseGuards(JwtAuthGuard)
    async addUserCategory(@Param('categoryId') categoryId: string, @Request() req){
        const userId = req.user.userId;
        const addedCategory = await this.userCategoriesService.addCategoryToUser(userId,+categoryId)
        return addedCategory;
    }

    @Delete(':categoryId')
    @UseGuards(JwtAuthGuard)
    async deleteUserCategory(@Param('categoryId') categoryId: string, @Request() req){
        const userId = req.user.userId;
        const deletedCategory = await this.userCategoriesService.deleteUserCategory(+categoryId,userId)
        return deletedCategory
    }
}
