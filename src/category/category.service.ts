import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CategoryService {
    constructor(private prisma: PrismaService){}

    async findAllCategories(){
        const category = await this.prisma.categories.findMany()
        return category;
    }

    async findOneCategory(id: number){
        const category = await this.prisma.categories.findUnique({
            where:{
                id
            }
        })
        return category
    }

    async findByTitle(title: string){
        const category = await this.prisma.categories.findFirst({
            where: {
                name: title
            }
        })
        return category
    }

    async createCategory(name: string){
        const findCategory = await this.findByTitle(name)
        if(findCategory){
            throw new BadRequestException('Category exists')
        }
        const createdCategory = this.prisma.categories.create({
            data:{ 
                name
            }
        })
        return createdCategory
    }
    async updateCategory(id: number, name: string){
        const findCategory = await this.findOneCategory(id)
        if(!findCategory){
            throw new NotFoundException('Category not found')
        }
        const updatedCategory = await this.prisma.categories.update({
            where:{
                id
            },
            data:{
                name
            }
        })
        return updatedCategory
    }

    async deleteCategory(id: number){
        const findCategory = await this.findOneCategory(id)
        if(!findCategory){
            throw new NotFoundException('Category not found')
        }
        const deletedCategory = await this.prisma.categories.delete({
            where:{
                id
            }
        })
        return deletedCategory;
    }
}
