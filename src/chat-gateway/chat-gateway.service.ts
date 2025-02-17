import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { SubscribeMessage, WebSocketGateway, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatsService } from 'src/chats/chats.service';
import { MessagesService } from 'src/messages/messages.service';

@Injectable()
@WebSocketGateway()
export class ChatGatewayService implements OnGatewayConnection, OnGatewayDisconnect {
    constructor(
        private chatsService: ChatsService,
        private messagesService: MessagesService,
    ){}

    @WebSocketServer()
    server: Server

    handleConnection(client: Socket) {
        console.log(`Client connected: ${client.id}`);
    }

    handleDisconnect(client: Socket) {
        console.log(`Client disconnected: ${client.id}`);
    }

    private async validateChat(chatId: number, userId: number){
        const findChat = await this.chatsService.findChat(+chatId)
        if(!findChat){
            throw new NotFoundException(`Chat with id: ${chatId} not found`)
        }
        if(!findChat.participants.map((participants => (participants.userId))).includes(userId)){
            throw new ForbiddenException('You don\'t have access')
        }
        if(findChat.isActive === false){
            throw new ForbiddenException('Chat not activeted')
        }
        return findChat
    }

    private async checkMessageExists(messageId: number, chatId: number, userId: number){
        const findMessage = await this.messagesService.findMessageByIdAndChatId(+messageId,+chatId)
        if(!findMessage){
            throw new NotFoundException('Message not found')
        }
        if(findMessage.senderId !== userId){
            throw new ForbiddenException('You can only update/delete your message')
        }
        return findMessage
    }

    @SubscribeMessage('joinChat')
    async handleJoinChat(client: Socket, payload: any) {
        console.log(payload)
        payload = JSON.parse(payload);

        const chatId = payload?.chatId;
        const userId = payload?.userId
        if (!chatId) {
            console.error('Chat ID or user ID is undefined or missing!');
            client.emit('error', { message: 'Chat ID is required.' });
            return;
        }
        await this.validateChat(+chatId,+userId)

        client.join(chatId);
        this.server.to(chatId).emit('userJoined', { userId: client.id });
        console.log(`Client ${client.id} joined chat ${chatId}`);
    }

    @SubscribeMessage('sendMessage')
    async sendMessage(client: Socket, payload: any){
        payload = JSON.parse(payload)

        const chatId = payload?.chatId
        const userId = payload?.userId
        const message= payload?.message

        if (!chatId || !message || !userId) {
            console.error('Message or Chat ID or User ID is undefined or missing!');
            client.emit('error', { message: 'Message, Chat ID and User ID are required.' });
            return;
        }

        await this.validateChat(+chatId,+userId)

        await this.messagesService.addMessage(+userId,+chatId,message)
        this.server.to(chatId).emit('getMessage', { user: client.id, message });
        console.log(`Client ${client.id} sent message to chat ${chatId}: ${message}`);
    }

    @SubscribeMessage('editMessage')
    async editMessage(client: Socket, payload: any){
        payload = JSON.parse(payload)

        const chatId = payload?.chatId
        const userId = payload?.userId
        const messageId = payload?.messageId
        const updatedMessage = payload?.updatedMessage

        if (!chatId || !messageId || !userId || !updatedMessage) {
            console.error('Message ID or Chat ID or User ID or updatedMessage is undefined or missing!');
            client.emit('error', { message: 'Message ID, Chat ID, User ID  and updatedMessage are required.' });
            return;
        }

        await this.validateChat(+chatId,+userId)
        await this.checkMessageExists(+messageId,+chatId,+userId)

        await this.messagesService.updateMessage(+userId,+messageId,+chatId, updatedMessage)
        this.server.to(chatId).emit('messageEdited', { user: client.id, updatedMessage, messageId });
        console.log(`Client ${client.id} update message to chat ${chatId}: ${updatedMessage}`);
    }

    @SubscribeMessage('deleteMessage')
    async deleteMessage(client: Socket, payload: any){
        payload = JSON.parse(payload)

        const chatId = payload?.chatId
        const userId = payload?.userId
        const messageId = payload?.messageId

        if (!chatId || !messageId || !userId) {
            console.error('MessageId or Chat ID or User ID  is undefined or missing!');
            client.emit('error', { message: 'Message ID, Chat ID, User ID  and updatedMessage are required.' });
            return;
        }

        await this.validateChat(+chatId,+userId)
        await this.checkMessageExists(+messageId,+chatId,+userId)

        await this.messagesService.deleteMessage(+userId,+messageId,+chatId)
        this.server.to(chatId).emit('messageDeleted', { user: client.id, messageId });
        console.log(`Client ${client.id} delete message to chat ${chatId}: ${messageId}`);
    }
}
