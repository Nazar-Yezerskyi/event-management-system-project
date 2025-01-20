import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { MailerService } from '@nestjs-modules/mailer';
import { SignInDto } from './dtos/sing-in.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        private userService: UserService,
        private mailerService: MailerService,
        private jwt: JwtService
        ){}

    private async hashPassword(password: string){
        const salt = await bcrypt.genSalt();
        const hash = await bcrypt.hash(password, salt);
        return `${salt}::${hash}`;
    }

    private async checkEmailExists(email: string){
        const users = await this.userService.findUserByEmail(email)
        if(users){
            throw new BadRequestException('email in use')
        }
    }


    async createAccount(firstName: string,lastName: string,email: string,password: string,accountImg?: string, confirmPassword?: string){
        const roleId = 1
        await this.checkEmailExists(email);
        if(password !== confirmPassword){
            throw new Error("Password and confirmPassword must mutch");
        }
        const verificationToken = crypto.randomBytes(32).toString('hex');
        
       
        const hashedpassword = await this.hashPassword(password) 
        const data = {
            firstName,
            lastName,
            email,
            roleId,
            password: hashedpassword.toString(),
            accountImg,
            verificationToken
        }
        const savedUser = await this.userService.createUser(data)

        const verificationUrl = `${process.env.API_URL}/auth/verify-email?token=${verificationToken}`;
        await this.mailerService.sendMail({
          to: email,
          subject: 'Please confirm your email',
          text: `Hello ${firstName},\n\nPlease confirm your email by clicking on the following link: ${verificationUrl}\n\nThank you!`,

          context: {
            firstName,
            verificationUrl,
          },
        });
        
        return savedUser;
    }

    async verifyAccount(verificationToken: string){
        const user = await this.userService.findByToken(verificationToken)
        if (!user) {
            throw new BadRequestException('Invalid or expired verification token.');
        }
        const updatedUser = this.userService.verifyUser(user.id)
      
          return updatedUser;
    }
    private async verifyPassword(password: string, storedPassword: string){
        const [salt, storedhash] = storedPassword.split('::');
        const hash = await bcrypt.hash(password, salt);
        return storedhash === hash;
    }

    private async generateAccessToken(id: number, email: string, roleId: number){
        const accessToken = await this.jwt.signAsync(
            {
                userId: id,
                email:  email,
                roleId: roleId
            },
            { secret: process.env.JWT_SECRET_KEY, expiresIn: process.env.JWT_EXPIRATION_TIME }
        );
        return accessToken;
    }

    private async generateRefreshToken(id: number, email: string, roleId: number){
        const refreshToken = await this.jwt.signAsync(
            {
                userId: id,
                email: email,
                roleId: roleId
            },
            { secret: process.env.JWT_REFRESH_SECRET_KEY, expiresIn: process.env.JWT_REFRESH_EXPIRATION_TIME },
        );
        return refreshToken
    }

    async signIn(body:SignInDto){
        const user = await this.userService.findUserByEmail(body.email);
        if(!user){
            throw new NotFoundException('user not found');
        }
        if (!user.isVerified) {
            throw new ForbiddenException('User must be verified');
          }
        const isPasswordValid = await this.verifyPassword(body.password,user.password);
        if(!isPasswordValid){
            throw new BadRequestException('bad password');
        }
        const updatedUser = await this.userService.updateLastLogIn(user.id);

        const accessToken = await this.generateAccessToken(user.id, user.email, user.roleId)

        const refreshToken = await this.generateRefreshToken(user.id, user.email, user.roleId)
        return {
            user: updatedUser,
            accessToken,
            refreshToken,
        };
    }

    async resetPasswordRequest(email: string){
        const user = await this.userService.findUserByEmail(email)
        if(!user){
            throw new NotFoundException('user not found');
        }
        const resetPasswordUrl = `${process.env.API_URL}/auth/reset-password/${email}`;
        await this.mailerService.sendMail({
          to: email,
          subject: 'Reset your password',
          text: `Hello ${user.firstName},\n\nReset your password by clicking on the following link: ${resetPasswordUrl}\n\nThank you!`,
          context: {
            resetPasswordUrl,
          },
        });
    }

    async resetPassword(email: string,password: string, confirmPassword: string ){
        const user = await this.userService.findUserByEmail(email)
        if(!user){
            throw new BadRequestException('Invalid email');
        }
        if(password !== confirmPassword){
            throw new BadRequestException('Password and confirmPassword must be match');
        }
        const hashedpassword = await this.hashPassword(password)
       
        const updatedUser = this.userService.updateUser(user.id.toString(),{password: hashedpassword.toString()})
        return updatedUser;
    }

}
