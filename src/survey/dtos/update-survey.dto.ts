import { IsString,IsNotEmpty, IsOptional, IsDateString } from 'class-validator';

export class UpdateSurveyDto{
    @IsString()
    @IsOptional()
    name?: string;

    @IsString()
    @IsOptional()
    showResult?: string

    @IsDateString()
    @IsOptional()
    expiresAt?: string

}