import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CompanyService } from 'src/company/company.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePromoCodeDto } from './dtos/create-promo-code.dto';
import { EventsService } from 'src/events/events.service';
import { v4 as uuidv4 } from "uuid"
import { UpdatePromoCodeDto } from './dtos/update-promo-code.dto';

@Injectable()
export class PromoCodesService {
    constructor(
        private prisma: PrismaService,
        private companyService: CompanyService,
        private eventsService: EventsService
    ){}

    async findPromoCode(id: number){
        const promoCode = await this.prisma.promoCodes.findUnique({
            where:{
                id
            }
        })
        return promoCode
    }

    async getAllCompanyPromoCodes(userId: number){
        const findCompany = await this.companyService.findCompanyByUser(userId)
        if(!findCompany){
            throw new NotFoundException('Company not found')
        }
        const promoCodes = await this.prisma.promoCodes.findMany({
            where:{
                companyId: findCompany.id
            }
        })
        return promoCodes
    }

    async createPromocode(promoCodeData: CreatePromoCodeDto, userId: number, eventId?:number){
        const findCompany = await this.companyService.findCompanyByUser(userId)
        if(!findCompany){
            throw new NotFoundException('Company not found')
        }
        if(eventId){
            const findEvent = await this.eventsService.findOneEvent(eventId)
            if(!findEvent){
                throw new NotFoundException('Event not found')
            }
            if(findEvent.companyId !== findCompany.id){
                throw new ForbiddenException('Yoc can only create promo code for your event')
            }
        }
        let code: string
        if(!promoCodeData.code){
            code = uuidv4().split('-')[0];
        }
        console.log(code)
        const createPromoCode = await this.prisma.promoCodes.create({
            data:{
                ...promoCodeData,
                code: code || promoCodeData.code,
                Events: eventId ? {connect: {id: eventId}} : undefined,
                expiresAt: new Date(promoCodeData.expiresAt),
                Companies: { connect: { id: findCompany.id } }
            }
        })
        return createPromoCode
    }
     
    async updatePromoCode(updatedeData: UpdatePromoCodeDto, promoCodeId: number, userId: number){
        const findPromoCode = await this.findPromoCode(promoCodeId)
        if(!findPromoCode){
            throw new NotFoundException('Promo code not found')
        }
        const findCompany = await this.companyService.findCompanyByUser(userId)
        if(findPromoCode.companyId !== findCompany.id){
            throw new ForbiddenException('You can only update  promo code for your event')
        }
        const updatedPromoCode = await this.prisma.promoCodes.update({
            where:{
                id: findPromoCode.id
            },
            data:{
                ...updatedeData
            }
        })
        return updatedPromoCode
    }

    async deletePromoCode(promoCodeId: number, userId: number){
        const findPromoCode = await this.findPromoCode(promoCodeId)
        if(!findPromoCode){
            throw new NotFoundException('Promo code not found')
        }
        const findCompany = await this.companyService.findCompanyByUser(userId)
        if(findPromoCode.companyId !== findCompany.id){
            throw new ForbiddenException('You can only delete promo code for your event')
        }
        const deletedPromoCode = await this.prisma.promoCodes.delete({
            where:{
                id: findPromoCode.id
            }
        })
        return deletedPromoCode;
    }
}
