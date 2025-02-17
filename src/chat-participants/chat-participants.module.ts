import { Module, forwardRef } from '@nestjs/common';
import { ChatParticipantsController } from './chat-participants.controller';
import { ChatParticipantsService } from './chat-participants.service';
import { JwtModule } from '@nestjs/jwt';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ChatsModule } from 'src/chats/chats.module';

@Module({
  imports: [PrismaModule, JwtModule, forwardRef(() => ChatsModule)],
  controllers: [ChatParticipantsController],
  providers: [ChatParticipantsService],
  exports: [ChatParticipantsService]
})
export class ChatParticipantsModule {}
