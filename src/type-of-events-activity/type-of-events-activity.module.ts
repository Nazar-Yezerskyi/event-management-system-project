import { Module } from '@nestjs/common';
import { TypeOfEventsActivityController } from './type-of-events-activity.controller';
import { TypeOfEventsActivityService } from './type-of-events-activity.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports:[PrismaModule, JwtModule],
  controllers: [TypeOfEventsActivityController],
  providers: [TypeOfEventsActivityService],
  exports:[TypeOfEventsActivityService]
})
export class TypeOfEventsActivityModule {}
