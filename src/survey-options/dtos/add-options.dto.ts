import { IsString,IsNotEmpty} from 'class-validator';

export class AddAndUpdateOptionsDto{
    @IsString()
    @IsNotEmpty()
    option: string

}