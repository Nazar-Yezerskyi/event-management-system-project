import { BadRequestException, ForbiddenException, Inject, Injectable, NotFoundException, forwardRef } from '@nestjs/common';
import { ChatParticipantsService } from 'src/chat-participants/chat-participants.service';
import { CompanyService } from 'src/company/company.service';
import { EventsService } from 'src/events/events.service';
import { OrderTicketService } from 'src/order-ticket/order-ticket.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ChatsService {
    constructor(
        private prisma: PrismaService,
        private companyService:CompanyService,
        private orderTicketService: OrderTicketService,
        private eventsService: EventsService,
        @Inject(forwardRef(() => ChatParticipantsService))
        private chatParticipantsService: ChatParticipantsService
    ){}

    async findAllCompanyChats(companyId: number, userId:number){
        const findCompany = await this.companyService.findCompany(companyId)
        if(!findCompany){
            throw new NotFoundException('Comapny not found')
        }
        if(findCompany.userId !== userId){
            throw new ForbiddenException('You don\'t have acces to chats')
        }
        const chats = await this.prisma.chats.findMany({
            where:{
                createdByCompanyId: findCompany.id
            }
        })
        return chats
    }

    async findChat(chatId: number){
        const chat = await this.prisma.chats.findUnique({
            where:{
                id: chatId
            },
            include:{
                company:true,
                participants: {
                    select:{
                        userId: true
                    }
                }
            }
        })
        return chat
    }

    async createChat(userId: number, eventId:number, isActive?: string, name?: string){
        const findEvent = await  this.eventsService.findOneEvent(eventId)
        if(!findEvent){
            throw new NotFoundException('Event not found')
        }
        let status: boolean
        if(isActive){
            status = isActive === 'true'
        }
        const findCompany = await this.companyService.findCompanyByUser(userId);
        if(!findCompany){
            throw new ForbiddenException("You cannot create a chat")
        }
        const findParticipants = await this.orderTicketService.findOrderedTicketByEvent(eventId, userId)
        if(!findParticipants){
            throw BadRequestException
        }
        const usersId = findParticipants.map(id => id.Users.id)
        const createdChat = await this.prisma.chats.create({
            data:{
                name: name ?? 'Unnamed Group',
                isActive: status,
                createdByCompanyId: findCompany.id
            }
        })

        await this.chatParticipantsService.addParticipantsToChat(createdChat.id, usersId)
        return createdChat
    }

    async updateChat(chatId: number, userId: number, name?:string,isActive?: string ){
        let status: boolean
        if(isActive){
            status = isActive === 'true'
        }
        const findChat = await this.findChat(chatId)
        if(!findChat){
            throw new NotFoundException('Chat not found')
        }
        if(findChat.company.userId !== userId){
            throw new ForbiddenException('You cannot update chat')
        }

        const updatedChat = await this.prisma.chats.update({
            where:{
                id: findChat.id
            },
            data:{
                name,
                isActive: status
            }
        })
        return updatedChat;
    }

    async deleteChat(chatId: number, userId: number){
        const findChat = await this.findChat(chatId)
        if(!findChat){
            throw new NotFoundException('Chat not found')
        }
        if(findChat.company.userId !== userId){
            throw new ForbiddenException('You can delete only your company\'s chat')
        }
        const deletedChat = await this.prisma.chats.delete({
            where:{
                id: findChat.id
            }
        })
        return deletedChat
    }

    
}