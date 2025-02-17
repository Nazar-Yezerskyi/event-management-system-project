import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateAndUpdateChatDto{
    @IsString()
    @IsOptional()
    name?: string;

    @IsString()
    @IsOptional()
    isActive?: string
}