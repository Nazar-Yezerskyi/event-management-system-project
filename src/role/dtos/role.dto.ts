import { IsString,IsNotEmpty } from 'class-validator';

export class RoleDto{
    @IsString()
    @IsNotEmpty()
    name: string;

}