import { Body, Controller,Post,UseGuards,Request, Put, Param, Query, Get } from '@nestjs/common';
import { RequestsService } from './requests.service';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { CreateRequestDto } from './dtos/create-request.dto';
import { RequestsType } from 'src/enums/requests-type.enum';
import { AdminGuard } from 'src/guards/admin.guard';

@Controller('requests')
export class RequestsController {
    constructor(private requestsService: RequestsService){}

    @Get(':id')
    @UseGuards(AdminGuard)
    async getRequest(@Param('id')id: string){
        const request = await this.requestsService.findRecord(+id)
        return request
    }

    @Get('/get-requests/:status')
    @UseGuards(AdminGuard)
    async getAllRequests(@Param('status')status: string){
        const requests = await this.requestsService.findRequests(status)
        return requests;
    }

    @Get('')
    @UseGuards(JwtAuthGuard)
    async getUserRequests(@Request() req){
        const userId = req.user.userId
        const requests = await this.requestsService.findUsersRequests(userId)
        return requests
    }
    
    @Post('/add-category')
    @UseGuards(JwtAuthGuard)
    async createRequest(@Body() body: CreateRequestDto, @Request() req){
        const userId = req.user.userId
        const createRequest = await this.requestsService.createRequest(body.data,body.description,userId,RequestsType.ADDCATEGORY)
        return createRequest;
    }

    @Put('/verify-request/:id')
    @UseGuards(AdminGuard)
    async verifyRequest(@Param('id') id: string,@Query('status') status: string ,@Request() req){
        const userId = req.user.userId
        const verifiedRequest = await this.requestsService.verifyRequest(+id,userId,status)
        return verifiedRequest
    }
}
