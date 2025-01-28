import { Module } from '@nestjs/common';
import { CompanyCategoriesController } from './company-categories.controller';
import { CompanyCategoriesService } from './company-categories.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';
import { CompanyModule } from 'src/company/company.module';
import { CategoryModule } from 'src/category/category.module';


@Module({
  imports: [PrismaModule, JwtModule,CompanyModule, CategoryModule],  
  controllers: [CompanyCategoriesController],
  providers: [CompanyCategoriesService]
})
export class CompanyCategoriesModule {}
