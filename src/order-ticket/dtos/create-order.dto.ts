import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateOrderDto {
    @IsString()
    @IsNotEmpty()
    placeId: string;

    @IsString()
    @IsOptional()
    promoCode?: string

}