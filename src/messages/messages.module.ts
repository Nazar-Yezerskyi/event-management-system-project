import { Module } from '@nestjs/common';
import { MessagesController } from './messages.controller';
import { MessagesService } from './messages.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ChatsModule } from 'src/chats/chats.module';
import { ChatParticipantsModule } from 'src/chat-participants/chat-participants.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [PrismaModule, ChatsModule, ChatParticipantsModule, JwtModule],
  controllers: [MessagesController],
  providers: [MessagesService],
  exports: [MessagesService]
})
export class MessagesModule {}
