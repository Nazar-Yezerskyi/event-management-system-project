import { Module } from '@nestjs/common';
import { UserCategoriesController } from './user-categories.controller';
import { UserCategoriesService } from './user-categories.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';
import { CategoryModule } from 'src/category/category.module';
import { UserModule } from 'src/user/user.module';

@Module({
  imports:[PrismaModule, JwtModule, CategoryModule, UserModule],
  controllers: [UserCategoriesController],
  providers: [UserCategoriesService]
})
export class UserCategoriesModule {}
