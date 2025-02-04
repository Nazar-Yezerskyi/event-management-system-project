import { Body, Controller, Get, Param, Post, UseGuards,Request, Put, Delete } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { CreateCommentDto } from './dtos/create-comment.dto';
import { UpdateCommentDto } from './dtos/update-comment.dto';

@Controller('comments')
export class CommentsController {
    constructor(private commentsService: CommentsService){}

    @Get(':commentId')
    async findComment(@Param('commentId') commentId: string){
        const comment = await this.commentsService.findComment(+commentId)
        return comment;
    }

    @Get('/byCompany/:companyId')
    async findCommentsByCompany(@Param('companyId') companyId: string){
        const comments = await this.commentsService.findCommentsByCompany(+companyId)
        return comments;
    }

    @Post()
    @UseGuards(JwtAuthGuard)
    async createComment(@Body() commentData: CreateCommentDto,@Request() req){
        const userId = req.user.userId
        const createComment = await this.commentsService.createComment(commentData,userId)
        return createComment;
    }
    @Put(':commentId')
    @UseGuards(JwtAuthGuard)
    async updateComment(@Body() updatedComment: UpdateCommentDto,@Param('commentId') commentId: string,@Request() req): Promise<{ id: number; userId: number; addedAt: Date; image: string; updatedAt: Date; companyId: number; eventId: number; content: string; }>{
        const userId = req.user.userId
        const updateComment = await this.commentsService.updateComment(updatedComment,userId,+commentId)
        return updateComment;
    }

    @Delete(':commentId')
    @UseGuards(JwtAuthGuard)
    async deleteComment(@Param('commentId') commentId: string, @Request() req){
        const userId = req.user.userId
        const deleteComment = await this.commentsService.deleteComment(userId,+commentId)
        return deleteComment;
    }
}
