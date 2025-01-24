import { IsString, IsEmail,IsNotEmpty, IsNumber, IsDateString, IsOptional } from 'class-validator';

export class UpdateNewsDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  content?: string;

  @IsString()
  @IsOptional()
  newsImg?: string;
}