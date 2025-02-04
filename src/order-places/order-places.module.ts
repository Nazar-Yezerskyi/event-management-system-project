import { Module } from '@nestjs/common';
import { OrderPlacesController } from './order-places.controller';
import { OrderPlacesService } from './order-places.service';
import { JwtModule } from '@nestjs/jwt';
import { PlacesModule } from 'src/places/places.module';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports:[JwtModule, PlacesModule, PrismaModule],
  controllers: [OrderPlacesController],
  providers: [OrderPlacesService],
  exports: [OrderPlacesService]
})
export class OrderPlacesModule {}
