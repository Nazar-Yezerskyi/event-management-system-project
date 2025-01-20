import { IsString, IsEmail, IsOptional, MinLength } from 'class-validator';

export class UpdateUserDto {
    @IsOptional()  
    @IsString() 
    firstName?: string;

    @IsOptional()  
    @IsString() 
    lastName?: string;

    @IsOptional()  
    @IsString() 
    accountImg?: string;

    @IsOptional()
    @IsEmail() 
    email?: string;

    @IsOptional()
    @IsString()
    password?: string;
}