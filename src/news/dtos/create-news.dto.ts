import { IsString, IsEmail,IsNotEmpty, IsNumber, IsDateString, IsOptional } from 'class-validator';

export class CreateNewsDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsString()
  @IsOptional()
  newsImg?: string;
}