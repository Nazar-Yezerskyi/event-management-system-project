import { Module } from '@nestjs/common';
import { ChatGatewayController } from './chat-gateway.controller';
import { ChatsModule } from 'src/chats/chats.module';
import { MessagesModule } from 'src/messages/messages.module';
import { ChatGatewayService } from './chat-gateway.service';

@Module({
  imports:[ChatsModule,MessagesModule],
  controllers: [ChatGatewayController],
  providers: [ChatGatewayService]
})
export class ChatGatewayModule {}
