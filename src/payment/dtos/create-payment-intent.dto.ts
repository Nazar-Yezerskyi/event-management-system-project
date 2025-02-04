import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreatePaymentIntentDto {
    @IsNumber()
    @IsNotEmpty()
    amount: number;

    @IsString()
    @IsNotEmpty()
    currency: string;

    @IsNumber()
    @IsNotEmpty()
    orderTicketId: number;

    @IsNumber()
    @IsNotEmpty()
    userId: number;

}