import { Injectable, NotFoundException } from '@nestjs/common';
import { CategoryService } from 'src/category/category.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from 'src/user/user.service';

@Injectable()
export class UserCategoriesService {
    constructor(
        private prisma: PrismaService,
        private categoryService: CategoryService,
        private userService: UserService
    ){}

    async getAllUserCategories(userId: number){
        const categories = await this.prisma.usersCategories.findMany({
            where:{
                userId
            },
            include:{
                Categories: true
            }
        })
        return categories
    }

    async addCategoryToUser(userId: number, categoryId: number){
        const findUser = await this.userService.findOneUser(userId)
        if(!findUser){
            throw new NotFoundException('User not found')
        }
        const findCategory = await this.categoryService.findOneCategory(categoryId)
        if(!findCategory){
            throw new NotFoundException('Category not found')
        }
        const addedCategoryToUser = await this.prisma.usersCategories.create({
            data:{
                categoryId,
                userId
            }
        })
        return addedCategoryToUser
    }

    private async findUserCategory(userId: number, categoryId: number){
        const findUserCategory = await this.prisma.usersCategories.findFirst({
            where:{
                categoryId,
                userId
            },
            include:{
                Users:{
                    include:{
                        UsersCategories: true
                    }
                }
            }
        })
        return findUserCategory
    }

    async deleteUserCategory(categoryId: number, userId: number){
        const findUserCategory = await this.findUserCategory(userId,categoryId)
        if(!findUserCategory){
            throw new NotFoundException('Record not found')
        }
        const deletedUserCategory = this.prisma.usersCategories.delete({
            where:{
                id:findUserCategory.id
            }
        })

        return deletedUserCategory;
    }
}
