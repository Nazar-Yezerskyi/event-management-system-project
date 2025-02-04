import { IsString,IsNotEmpty, IsOptional, IsNumber } from 'class-validator';

export class UpdateCommentDto {
    @IsString()
    @IsOptional()
    image?: string;

    @IsString()
    @IsOptional()
    content?: string

    @IsNumber()
    @IsOptional()
    eventId?: number
}