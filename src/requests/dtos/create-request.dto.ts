import { IsString,IsObject } from 'class-validator';

export class CreateRequestDto{
    @IsObject()
    data: object

    @IsString()
    description: string;

}