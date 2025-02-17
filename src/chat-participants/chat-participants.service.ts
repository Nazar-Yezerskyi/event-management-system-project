import { ForbiddenException, Inject, Injectable, NotFoundException, forwardRef } from '@nestjs/common';
import { ChatsService } from 'src/chats/chats.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ChatParticipantsService {
    constructor(
        private prisma: PrismaService,
        @Inject(forwardRef(() => ChatsService))
        private chatsService: ChatsService
    ){}

    async findRecord(chatId: number){
        const findRecord = await this.prisma.chatParticipants.findMany({
            where:{
                chatId
            }
        })
        return findRecord
    }

    async addParticipantsToChat(chatId: number, participants: number[]){
        const addMembers = participants.map(userId => ({chatId, userId}))
        const addParticipants = await this.prisma.chatParticipants.createMany({
            data: addMembers
        })
        return addParticipants
    }

    async deleteParticipants(chatId: number, participants: string, userId: number){
        const findChat = await this.chatsService.findChat(chatId)
        if(!findChat){
            throw new NotFoundException('Chat not found')
        }
        if(findChat.company.userId !== userId){
            throw new ForbiddenException('You cannot delete participants')
        }
        const participantsArr = participants.split(',').map(Number)
        const findRecord = await this.findRecord(chatId)
        if(!findRecord){ 
            throw new NotFoundException('Record not found')
        }

        const deleteParticipants = await this.prisma.chatParticipants.deleteMany({
            where:{
                chatId,
                userId:{
                    in: participantsArr
                }
            }
        })
        return deleteParticipants
    }
}
