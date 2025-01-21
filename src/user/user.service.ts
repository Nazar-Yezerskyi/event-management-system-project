import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';

@Injectable()
export class UserService {
    constructor( private prisma: PrismaService){}

    async findAll(email?: string) {
        return await this.prisma.users.findMany({
          where: {
            AND: [
              email
                ? {
                    email: {
                      contains: email,
                      mode: 'insensitive',
                    },
                  }
                : {},
            ],
          },
        });
    }
    async findUserByEmail(email: string){
        const user = await this.prisma.users.findUnique({
            where:{
                email
            }
        })
        return user
    }
    async findOneUser(id: number){
        const user = await this.prisma.users.findUnique({
            where:{
                id
            }
        })
        if(!user){
            throw new NotFoundException(`User with id ${id} not found`)
        }
        return user;
    }
    async createUser(userData: CreateUserDto){
        const createdUser = await this.prisma.users.create({
            data:{
                firstName: userData.firstName,
                lastName: userData.lastName,
                email: userData.email,
                password: userData.password,
                roleId: userData.roleId,
                verificationToken: userData.verificationToken,
                createdAt: new Date()
                
            }
        })
        return createdUser;
    }

    async findByToken(token: string){
        const user = await this.prisma.users.findFirst({
            where:{
                verificationToken: token
            }
        })
        if(!user){
            throw new NotFoundException(`User not found`)
        }
        return user
    }

    async verifyUser(id: number){
        const verifiedUser = await this.prisma.users.update({
            where:{
                id
            },
            data:{
                isVerified: true,
                verificationToken: null,  
            }
        })
        return verifiedUser
    }

    async updateLastLogIn(id: number){
        const updatedUser = await this.prisma.users.update({
            where:{
                id
            },
            data:{
                lastLogIn: new Date()
            }
        })
        return {
            ...updatedUser,
            createdAt: updatedUser.createdAt.toISOString(),
            lastLogIn: updatedUser.lastLogIn.toISOString(),
          };
    }

    async updateUser(id: string, updateUserDto: UpdateUserDto) {
        const user = await this.findOneUser(+id);  
        const updatedData = {...updateUserDto}

        const updatedUser = await this.prisma.users.update({
            where:{
              id: user.id
            },
            data:updatedData
        })
       
        return updateUserDto
    }
    
    async deleteUser(id: number){
        const user = await this.findOneUser(id)
        if(!user){
            throw new NotFoundException('User not found')
        } 
        const deletedUser = await this.prisma.users.delete({
            where:{
                id
            }
        })
        return deletedUser;
    }
}
