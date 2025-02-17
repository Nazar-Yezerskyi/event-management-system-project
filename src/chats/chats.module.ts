import { Module, forwardRef } from '@nestjs/common';
import { ChatsController } from './chats.controller';
import { ChatsService } from './chats.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';
import { CompanyModule } from 'src/company/company.module';
import { OrderTicketModule } from 'src/order-ticket/order-ticket.module';
import { EventsModule } from 'src/events/events.module';
import { ChatParticipantsModule } from 'src/chat-participants/chat-participants.module';

@Module({
  imports:[PrismaModule,JwtModule, CompanyModule,OrderTicketModule, EventsModule,forwardRef(() =>ChatParticipantsModule)],
  controllers: [ChatsController],
  providers: [ChatsService],
  exports: [ChatsService]
})
export class ChatsModule {}
