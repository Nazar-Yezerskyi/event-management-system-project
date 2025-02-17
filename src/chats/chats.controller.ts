import { Controller, Get, Param, UseGuards,Request, Post, Body, Put } from '@nestjs/common';
import { ChatsService } from './chats.service';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { CreateAndUpdateChatDto } from './dtos/create-and-update-chat.dto';

@Controller('chats')
export class ChatsController {
    constructor(private chatsService: ChatsService){}

    @Get(':companyId')
    @UseGuards(JwtAuthGuard)
    async getChatsByCompany(@Param('companyId') companyId: string, @Request() req){
        const userId = req.user.userId;
        return await this.chatsService.findAllCompanyChats(+companyId, userId)
    }

    @Post(':eventId')
    @UseGuards(JwtAuthGuard)
    async createChat(@Body() body: CreateAndUpdateChatDto,@Param('eventId') eventId: string, @Request() req){
        const userId = req.user.userId;
        return await this.chatsService.createChat(userId,+eventId,body.isActive,body.name)
    }

    @Put(':chatId')
    @UseGuards(JwtAuthGuard)
    async updateChat(@Param('chatId') chatId: string,@Body() body: CreateAndUpdateChatDto, @Request() req){
        const userId = req.user.userId;
        return await this.chatsService.updateChat(+chatId,userId,body.name,body.isActive)
    }
}
