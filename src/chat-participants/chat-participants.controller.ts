import { Controller, Delete, Param, Query, Request, UseGuards } from '@nestjs/common';
import { ChatParticipantsService } from './chat-participants.service';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';

@Controller('chat-participants')
export class ChatParticipantsController {
    constructor(private chatParticipantsService: ChatParticipantsService){}

    @Delete('/:chatId')
    @UseGuards(JwtAuthGuard)
    async deleteParticipants(@Param('chatId') chatId: string, @Query('users') users: string, @Request() req){
        const userId = req.user.userId
        const deletedParticipants = await this.chatParticipantsService.deleteParticipants(+chatId,users,userId)
        return deletedParticipants
    }
}
