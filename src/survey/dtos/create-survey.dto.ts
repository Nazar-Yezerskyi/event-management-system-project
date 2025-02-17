import { IsString,IsNotEmpty, IsOptional, IsDateString } from 'class-validator';

export class CreateSurveyDto{
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsOptional()
    showResult?: string

    @IsDateString()
    @IsOptional()
    expiresAt?: string

}