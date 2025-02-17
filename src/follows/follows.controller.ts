import { Controller, Get, UseGuards, Request, Post, Param, Put, Query } from '@nestjs/common';
import { FollowsService } from './follows.service';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';

@Controller('follows')
export class FollowsController {
    constructor(private followsService: FollowsService){}

    @Get('/followers')
    @UseGuards(JwtAuthGuard)
    async getFollowers(@Request() req){
        const userId =req.user.userId
        const getFollowers = await this.followsService.getFollowers(userId)
        return getFollowers;
    }

    @Get('/following')
    @UseGuards(JwtAuthGuard)
    async getFollowing(@Request() req){
        const userId = req.user.userId
        const getFollowing = await this.followsService.getFollowing(userId)
        return getFollowing;
    }

    @Get('/pending-follows')
    @UseGuards(JwtAuthGuard)
    async getPendingFollows(@Request() req){
        const userId = req.user.userId
        const getPendingFollow = await this.followsService.getPendingFollow(userId)
        return getPendingFollow
    }

    @Post(":followingId")
    @UseGuards(JwtAuthGuard)
    async createFollow(@Param('followingId') followingId: string, @Request() req){
        const userId= req.user.userId
        const createFollow = await this.followsService.createFollow(+followingId,userId)
        return createFollow;
    }

    @Put(':recordId')
    @UseGuards(JwtAuthGuard)
    async updateFollowStatus(@Param('recordId') recordId: string,@Query('status') status: string, @Request() req){
        const userId = req.user.userId
        const updateFollowStatus = await this.followsService.approveOrRejectFollow(+recordId,status,userId)
        return updateFollowStatus;
    }

    @Put('delete-follow/:recordId')
    @UseGuards(JwtAuthGuard)
    async deleteFollow(@Param('recordId') recordId: string, @Request() req){
        const userId = req.user.userId
        const deleteFollow = await this.followsService.deleteFollows(+recordId,userId)
        return deleteFollow
    }
}
