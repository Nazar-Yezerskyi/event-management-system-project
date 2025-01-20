import { Controller, Post, Body, Get, Query, BadRequestException, UseGuards, Param, Put,  } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { SignInDto } from './dtos/sing-in.dto';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { ResetPasswordDto } from './dtos/reset-password.dto';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService){}

    @Post('/sign-up')
    async createAccount(@Body() body: CreateUserDto){
        return this.authService.createAccount(body.firstName, body.lastName,body.email, body.password, body.accountImg, body.confirmPassword)
    }

    @Post('/sign-in')
    async signIn(@Body() body: SignInDto){
        return this.authService.signIn(body)
    }

    @Get('/verify-email')
    async verifyAccount(@Query('token') verificationToken: string) {
        console.log(verificationToken)
        const updatedUser = await this.authService.verifyAccount(verificationToken);
        return { message: 'Email successfully verified', user: updatedUser };
    }

    @UseGuards(JwtAuthGuard)
    @Get('reset-password-request/:email')
    async ressetPasswordsRequest(@Param('email') email: string){
        return await this.authService.resetPasswordRequest(email)
    }

    @Put('reset-password/:email')
    @UseGuards(JwtAuthGuard)  
    async updateUser(@Param('email') email: string,@Body() resetPassword: ResetPasswordDto){
        const {password, confirmPassword} = resetPassword
        const updatedUser = await this.authService.resetPassword(email,password, confirmPassword)
        return updatedUser;
    }

}
