import { IsString,IsNotEmpty, IsOptional, IsNumber, Max, Min, IsDateString } from 'class-validator';

export class CreatePromoCodeDto{
    @IsString()
    @IsOptional()
    code?: string;

    @IsNumber()
    @Min(1)
    @Max(99)
    discountPercent: number;

    @IsNumber()
    @IsOptional()
    @Min(1)
    maxUsages?: number

    @IsDateString()
    expiresAt: string;

    @IsString()
    description: string;

    @IsNumber()
    @Min(1)
    @IsOptional()
    minOrderPrice?: number

}