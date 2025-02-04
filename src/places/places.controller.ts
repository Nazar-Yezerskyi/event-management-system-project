import { Controller, Param, Post, Query, UseGuards,Request, Delete, Body, Get } from '@nestjs/common';
import { PlacesService } from './places.service';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { AddOnePlaceDto } from './dtos/add-one-place.dto';

@Controller('places')
export class PlacesController {
    constructor(private placesService: PlacesService){}

    @Get(':eventId')
    @UseGuards(JwtAuthGuard)
    async getPlacesInfo(@Param('eventId') eventId: string, @Request() req){
        const userId = req.user.userId
        const getInfo = await this.placesService.getPlacesInfo(+eventId,userId)
        return getInfo
    }

    @Post(':eventId')
    @UseGuards(JwtAuthGuard)
    async addPlaces(@Param('eventId') eventId: string, @Query('rows') rows: string, @Request() req, @Query('numberOfSeats') seats?: string){
        const userId =  req.user.userId
        const addedPlace = await this.placesService.addPlaces(+eventId,userId,+rows, seats)
        return addedPlace;
    }

    @Post('/add-one-place/:eventId')
    @UseGuards(JwtAuthGuard)
    async addOnePlace(@Param('eventId') eventId: string, @Body() body: AddOnePlaceDto, @Request() req){
        const userId = req.user.userId
        const addPlace = await this.placesService.addOnePlace(+eventId,body.seatNumber,body.row,userId)
        return addPlace
    }
    
    @Delete('/:eventId')
    @UseGuards(JwtAuthGuard)
    async deleteAllPlaces(@Param('eventId') eventId: string, @Request() req){
        const userId = req.user.userId
        const deletedPlaces = await this.placesService.deleteAllPlaces(+eventId,userId)
        return deletedPlaces
    }

    @Delete('delete-one-place/:eventId/:row/:seatNumber')
    @UseGuards(JwtAuthGuard)
    async deleteOnePlace(
        @Param('eventId') eventId: string, 
        @Param('row') row: string, 
        @Param('seatNumber') seatNumber: string,
        @Request() req
    ){
        const userId = req.user.userId
        const deletedPlace = await this.placesService.deleteOnePlace(+eventId,+seatNumber,+req,userId)
        return deletedPlace
    }

}
