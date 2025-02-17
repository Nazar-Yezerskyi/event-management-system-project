import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { FollowsStatus } from 'src/enums/follows-status.enum';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class FollowsService {
    constructor(
        private prisma: PrismaService,
    ){}

    async findRecord(followingId: number, followedById:number){
        const findRecord = await this.prisma.follows.findFirst({
            where:{
               followedById:{
                in:[followingId,followedById]
               },
               followingId:{
                in:[followingId,followedById]
               }
            },
            include: {
                Users_Follows_followingIdToUsers: true,
                Users_Follows_followedByIdToUsers: true
            }
        })
        return findRecord
    }

    async getPendingFollow(userId: number){
        const getPendingFollow = await this.prisma.follows.findMany({
            where:{
                followingId: userId,
                status: FollowsStatus.PENDING
            },
            include:{
                Users_Follows_followedByIdToUsers:{
                    select:{
                        firstName: true,
                        lastName: true,
                        email: true   
                    }
                }
            }
        })
        return getPendingFollow
    }

    async createFollow(followingId: number, followedById:number){
        const findRecord = await this.findRecord(followingId,followedById)
        if(findRecord && findRecord.status !== FollowsStatus.UNFOLLOW){
            throw new BadRequestException(`Record already exists, status: ${findRecord.status}`)
        }
        const createFollow = await this.prisma.follows.create({
            data:{
                followedById,
                followingId
            }     
        })
        return createFollow;
    }
    async findRecordById(id: number){
        const findRecord = await this.prisma.follows.findUnique({
            where:{
                id
            }
        })
        return findRecord
    }
    async approveOrRejectFollow(recordId: number, status: string, userId: number){
        if (!Object.values(FollowsStatus).includes(status as FollowsStatus)) {
            throw new BadRequestException('Invalid status value');
        }
        const findRecord = await this.findRecordById(recordId)
        if(!findRecord){
            throw new NotFoundException('Record not found')
        }
        if(findRecord.followingId === userId){
            const updatedRecord = await this.prisma.follows.update({
                where:{
                    id: findRecord.id
                },
                data:{
                    status
                }
            })
            return updatedRecord
        } else{
            throw new ForbiddenException('Access denied')
        }
    }
    async getFollowers(userId:number){
        const find = await this.prisma.follows.findMany({
            where:{
                followingId: userId,
                status: FollowsStatus.APPROVED
            }
        })
        return find
    }

    async getFollowing(userId: number){
        const find = await this.prisma.follows.findMany({
            where:{
                followedById: userId,
                status: FollowsStatus.APPROVED
            }
        })
        return find
    }
    
    async deleteFollows(recordId: number, userId: number){
        const findRecord = await this.findRecordById(recordId)
        if(!findRecord){
            throw new NotFoundException('Record not found')
        }
        if(findRecord.followedById !== userId || findRecord.followingId !== userId){
            throw new ForbiddenException('Access denied')
        }
        const deleteFollows = await this.prisma.follows.update({
            where:{
                id: findRecord.id
            },
            data:{
                status: FollowsStatus.UNFOLLOW
            }
        })
        return deleteFollows
    }
}
