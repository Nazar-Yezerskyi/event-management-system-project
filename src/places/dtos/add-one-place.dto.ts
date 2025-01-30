import { IsString, IsEmail,IsNotEmpty, IsNumber, IsDateString, IsOptional } from 'class-validator';

export class AddOnePlaceDto {
  @IsNumber()
  @IsNotEmpty()
  row: number;

  @IsNumber()
  @IsNotEmpty()
  seatNumber: number;
}