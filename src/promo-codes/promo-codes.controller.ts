import { Body, Controller, Delete, Get, Param, Post, Put, Query, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { CreatePromoCodeDto } from './dtos/create-promo-code.dto';
import { PromoCodesService } from './promo-codes.service';
import { UpdatePromoCodeDto } from './dtos/update-promo-code.dto';

@Controller('promo-codes')
export class PromoCodesController {
    constructor(
        private promoCodesService: PromoCodesService
    ){}
    
    @Get()
    @UseGuards(JwtAuthGuard)
    async getAllCopnanyPromoCodes(@Request() req){
        const userId = req.user.userId
        const promoCodes = await this.promoCodesService.getAllCompanyPromoCodes(userId)
        return promoCodes;
    }

    @Post()
    @UseGuards(JwtAuthGuard)
    async createPromoCode(@Body() promoCodeData: CreatePromoCodeDto, @Request() req, @Query('eventId') eventId?: string){
        const userId = req.user.userId;
        const createPromoCode = await this.promoCodesService.createPromocode(promoCodeData,userId,+eventId)
        return createPromoCode;
    }

    @Put(':promoCodeId')
    @UseGuards(JwtAuthGuard)
    async updatePromoCode(@Body() updatePromoCode: UpdatePromoCodeDto, @Param('promoCodeId')promoCodeId: string, @Request() req){
        const userId = req.user.userId;
        const updatedPromoCode = await this.promoCodesService.updatePromoCode(updatePromoCode,+promoCodeId,userId)
        return updatedPromoCode;
    }

    @Delete(':promoCodeId')
    @UseGuards(JwtAuthGuard)
    async deletePromoCode(@Param('promoCodeId') promoCodeId: string, @Request() req){
        const userId = req.user.userId
        const deletedPromoCode = await this.promoCodesService.deletePromoCode(+promoCodeId,userId)
        return deletedPromoCode;
    }
}
