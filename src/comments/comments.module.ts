import { Module } from '@nestjs/common';
import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';
import { CompanyModule } from 'src/company/company.module';
import { EventsModule } from 'src/events/events.module';

@Module({
  imports:[PrismaModule,JwtModule,CompanyModule,EventsModule],
  controllers: [CommentsController],
  providers: [CommentsService]
})
export class CommentsModule {}
