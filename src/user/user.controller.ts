import { Controller, Query,Get, Param, Put, UseGuards, Body, Request, BadRequestException, Delete } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { UpdateUserDto } from './dtos/update-user.dto';

@Controller('user')
export class UserController {
    constructor(private userService: UserService){}

    @Get('')
    async findAll(@Query('email') email?: string){
        return await this.userService.findAll(email)
    }

    @Get(':id')
    async findOne(@Param('id') id: string){
        return await this.userService.findOneUser(+id)
    }

    @Put(':id')
    @UseGuards(JwtAuthGuard)  
    async updateUser(@Param('id') id: string,@Body() updateUserDto: UpdateUserDto,@Request() req){
        if (req.user.userId !== +id) {
            throw new BadRequestException('You can only update your own profile');
        }
        const updatedUser = await this.userService.updateUser(id, updateUserDto);
        return updatedUser;
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard) 
    async deleteUser(@Param('id') id: string, @Request() req) {
        if (req.user.userId !== +id) {
            throw new BadRequestException('You can only delete your own profile');
        }
        const userToDelete =  await this.userService.deleteUser(+id);
        return { message: 'User successfully deleted' };
    }
}
