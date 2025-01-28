import { IsString,IsNotEmpty } from 'class-validator';

export class createEventTypeDto{
    @IsString()
    @IsNotEmpty()
    name: string;
}