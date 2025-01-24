import { Module } from '@nestjs/common';
import { EventsTypeController } from './events-type.controller';
import { EventsTypeService } from './events-type.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { TypeOfEventsActivityModule } from 'src/type-of-events-activity/type-of-events-activity.module';
import { JwtModule } from '@nestjs/jwt';
import { EventsModule } from 'src/events/events.module';

@Module({
  imports:[PrismaModule,TypeOfEventsActivityModule, EventsModule, JwtModule],
  controllers: [EventsTypeController],
  providers: [EventsTypeService]
})
export class EventsTypeModule {}
