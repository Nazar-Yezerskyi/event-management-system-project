import { Body, Controller, Get, Param, Post, Request, UseGuards } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { AddMessageDto } from './dtos/add-message.dto';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';

@Controller('messages')
export class MessagesController {
    constructor(private messagesService: MessagesService){}

    @Post()
    async addMessage(@Body() body: AddMessageDto){
        return await this.messagesService.addMessage(2,2,body.text)
        
    }

    @Get(':chatId')
    @UseGuards(JwtAuthGuard)
    async getMessages(@Param('chatId') chatId: string, @Request() req){
        const userId = req.user.userId
        const messages = await this.messagesService.getMessages(+chatId,userId)
        return messages
    }
    
}
