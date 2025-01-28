import { IsString,IsNotEmpty, IsOptional, IsNumber, Max, Min, IsDateString } from 'class-validator';

export class UpdatePromoCodeDto{
    @IsString()
    @IsOptional()
    code?: string;

    @IsNumber()
    @Min(1)
    @Max(99)
    @IsOptional()
    discountPercent?: number;

    @IsNumber()
    @IsOptional()
    @Min(1)
    maxUsages?: number

    @IsDateString()
    @IsOptional()
    expiresAt?: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsNumber()
    @Min(1)
    @IsOptional()
    minOrderPrice?: number

}