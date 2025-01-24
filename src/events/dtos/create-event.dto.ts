import { IsString, IsEmail,IsNotEmpty, IsNumber, IsDateString } from 'class-validator';

export class CreateEventDto {
  @IsString()
  @IsNotEmpty()
  eventImg: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @IsNotEmpty()
  ticket_price: number;

  @IsDateString()
  @IsNotEmpty()
  date: string;

  @IsNumber()
  @IsNotEmpty()
  duration_in_minutes: number;

  @IsString()
  @IsNotEmpty()
  start_time: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  place_of_event: string;

  @IsString()
  @IsNotEmpty()
  country: string;

  @IsString()
  @IsNotEmpty()
  city: string;

  @IsString()
  @IsNotEmpty()
  street: string;

  @IsNumber()
  @IsNotEmpty()
  number_of_seats: number;
}