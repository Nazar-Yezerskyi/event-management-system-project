import { IsString, IsEmail,IsNotEmpty, IsOptional, IsNumber } from 'class-validator';

export class CreateCommentDto {
    @IsString()
    @IsOptional()
    image?: string;

    @IsString()
    @IsNotEmpty()
    content: string

    @IsNumber()
    companyId: number;

    @IsNumber()
    @IsOptional()
    eventId?: number
}