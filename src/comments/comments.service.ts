import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CompanyService } from 'src/company/company.service';
import { EventsService } from 'src/events/events.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCommentDto } from './dtos/create-comment.dto';
import { UpdateCommentDto } from './dtos/update-comment.dto';

@Injectable()
export class CommentsService {
    constructor(
        private prisma: PrismaService,
        private companyService: CompanyService,
        private eventsService: EventsService
    ){}

    async findComment(id: number){
        const comment = await this.prisma.comments.findUnique({
            where:{
                id
            }
        })
        return comment
    }
    async findCommentsByCompany(companyId){
        const findComments = await this.prisma.comments.findMany({
            where:{
                companyId

            },
            orderBy:{
                addedAt: 'desc'
            }
        })
        return findComments
    }

    async createComment(commentData: CreateCommentDto, userId:number){
        const findCompany = await this.companyService.findCompany(commentData.companyId)
        if(!findCompany){
            throw new NotFoundException('Company not found')
        }
        if(commentData.eventId){
            const findEvent = await this.eventsService.findOneEvent(commentData.eventId)
            if(!findEvent){
                throw new NotFoundException('Event not found')
            }
        }
        const createdComment = await this.prisma.comments.create({
            data:{
                ...commentData,
                userId,
            }
        })
        return createdComment
    }

    async updateComment(commentData: UpdateCommentDto,userId:number, commentId: number){
        const findComment = await this.findComment(commentId)
        if(!findComment){
            throw new NotFoundException('Comment not found')
        }
        if(findComment.userId !== userId){
            throw new ForbiddenException('You can only update your comment')
        }
        const updatedComment = await this.prisma.comments.update({
            where:{
                id: findComment.id
            },
            data:{
                ...commentData,
                updatedAt: new Date()
            }
        })
        return updatedComment
    }

    async deleteComment(userId: number, commentId: number){
        const findComment = await this.findComment(commentId)
        if(!findComment){
            throw new NotFoundException('Comment not found')
        }
        if(findComment.userId !== userId){
            throw new ForbiddenException('You can only delete your comment')
        }
        const deletedComment = await this.prisma.comments.delete({
            where:{
                id: findComment.id
            }
        })
        return deletedComment;
    }
}
