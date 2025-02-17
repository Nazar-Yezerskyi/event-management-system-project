import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { ChatParticipantsService } from 'src/chat-participants/chat-participants.service';
import { ChatsService } from 'src/chats/chats.service';
import { PrismaService } from 'src/prisma/prisma.service';
import * as crypto from 'crypto';

@Injectable()
export class MessagesService {
    constructor(
        private prisma:PrismaService, 
        private chatsService: ChatsService,
        private chatParticipant: ChatParticipantsService
    ){}

    async getMessages(chatId: number, userId:number){
        const findChat= await this.chatsService.findChat(chatId)
        if(!findChat){
            throw new NotFoundException('Chat not found')
        }
        const findParticipants = await this.chatParticipant.findRecord(chatId)
        const members = findParticipants.map((id => id.userId))
        if(!members.includes(userId)){
            throw new ForbiddenException('You don\'t have access')
        }
        const chatMessages = await this.prisma.messages.findMany({
            where: {
                chatId
            },
            include:{
                sender:true
            },
            orderBy: {
                createdAt: 'desc',
            },
        })

        const decryptedMessage = chatMessages.map(message => {
            const decryptedMessage = this.decrypt(message.content)
            return {...message, content: decryptedMessage};
        })

        return decryptedMessage;
    }

    async addMessage(userId: number, chatId: number, message: string){
        const findChat = await this.chatsService.findChat(chatId)
        if(!findChat){
            throw new NotFoundException('Chat not found')
        }
        const findParticipants = await this.chatParticipant.findRecord(chatId)
        const members = findParticipants.map((id => id.userId))
        if(!members.includes(userId)){
            throw new ForbiddenException('You don\'t have access')
        }
        const encryptedMessage = this.encrypt(message)
        const addedMessage = await this.prisma.messages.create({
            data:{
                senderId: userId,
                chatId: chatId,
                content: encryptedMessage
            }
        })
        return addedMessage
    }

    async findMessageByIdAndChatId(messageId: number, chatId: number){
        const findMessage = await this.prisma.messages.findFirst({
            where:{
                id: messageId,
                chatId
            }
        })
        return findMessage
    }
    async findRecord(recordId: number){
        const findRecord = await this.prisma.messages.findUnique({
            where:{
                id: recordId
            }
        })
        return findRecord
    }
    async deleteMessage(userId: number, messageId: number, chatId: number){
        const findRecord = await this.findRecord(messageId)
        if(!findRecord){
            throw new NotFoundException('Message not found')
        }
        if(findRecord.senderId !== userId || findRecord.chatId !== chatId){
            throw new ForbiddenException('You cannot delete message')
        }
        const deletedMessage = await this.prisma.messages.delete({
            where:{
                id: findRecord.id
            }
        })
        return deletedMessage
    }

    async updateMessage(userId: number, messageId: number, chatId: number, message: string){
        const findRecord = await this.findRecord(messageId)
        if(!findRecord){
            throw new NotFoundException('Message not found')
        }
        if(findRecord.senderId !== userId || findRecord.chatId !== chatId){
            throw new ForbiddenException('You cannot delete message')
        }
        const encryptedMessage = this.encrypt(message)
        const updatedMessage = await this.prisma.messages.update({
            where:{
                id: findRecord.id
            },
            data:{
                content: encryptedMessage
            }
        })
        return updatedMessage
    }
    encrypt(text: string){
        const key = Buffer.from(process.env.ENCRYPTION_KEY, 'hex')
        const cipher = crypto.createCipheriv(process.env.ALGORITHM, key, null)
        let encrypted = cipher.update(text,'utf8','hex')
        encrypted += cipher.final('hex')
        return encrypted
    }

    decrypt(text: string){
        const key = Buffer.from(process.env.ENCRYPTION_KEY, 'hex')
        const decipher = crypto.createDecipheriv(process.env.ALGORITHM,key, null)
        let decrypted = decipher.update(text, 'hex', 'utf8')
        decrypted += decipher.final('utf8')
        return decrypted
    }
}
