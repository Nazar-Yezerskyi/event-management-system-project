import { Injectable } from '@nestjs/common';
import { PlacesService } from 'src/places/places.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class OrderPlacesService {
    constructor(
        private prisma: PrismaService,
        private placesService: PlacesService
    ){}

    async findOrderedSeats(seatsId:any[] ){
        const find = await this.prisma.orderPlaces.findMany({
            where:{
                OR: seatsId.map(seatId =>({
                    placeId: seatId
                }))
            },
            include:{
                Places:true
            }
            
        })
        return find
    }

    async deleteOrderedSeats(seatsId:any[]){
        const deletedSeats = await this.prisma.orderPlaces.deleteMany({
            where:{
                OR: seatsId.map(seatId =>({
                    id: seatId.id
                }))
            }
        })
        return deletedSeats
    }
}
