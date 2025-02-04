import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { EventsService } from 'src/events/events.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PlacesService {
    constructor(
        private prisma: PrismaService,
        private eventsService: EventsService
    ){}

    async getPlacesInfo(eventId: number, userId: number){
        const findEvent = await this.eventsService.findOneEvent(eventId)
        if(!findEvent){
            throw new NotFoundException('Event not found')
        }
        if(findEvent.Companies.userId !== userId){
            throw new ForbiddenException('You can only get info about places to your event')
        }
        const places = await this.findAllPlaces(eventId)
        return places
    }
    async findAllPlaces(eventId: number){
        const places = await this.prisma.places.findMany({
            where:{
                eventId: eventId
            }
        })
        return {places, count: places.length}
    }
    async addPlaces(eventId: number, userId: number, rows: number, seats?: string) {
        const event = await this.eventsService.findOneEvent(eventId);
        if (!event) {
            throw new NotFoundException('Event not found');
        }
    
        const places = await this.findAllPlaces(eventId);
        if (event.number_of_seats === places.count) {
            throw new ForbiddenException('All places have already been added');
        }
        if (event.Companies.userId !== userId) {
            throw new ForbiddenException('You can only add places to your event');
        }
    
        const placesData = [];
        if (!seats) {
            if (event.number_of_seats % rows !== 0) {
                throw new BadRequestException(
                    'Number of seats is not exactly divisible by the number of rows. You need to specify the number of seats for each row.'
                );
            }
    
            const seatsPerRow = event.number_of_seats / rows;
            for (let row = 1; row <= rows; row++) {
                for (let seat = 1; seat <= seatsPerRow; seat++) {
                    placesData.push({ row, seatNumber: seat, eventId });
                }
            }
        } else {
            const seatCounts = seats.split(',').map(Number);
            const sumSeat = seatCounts.reduce((sum, seatCounts) => sum + seatCounts, 0)
            if(sumSeat > event.number_of_seats || sumSeat <= 0 ){
                throw new BadRequestException('Incorrect number of seats')
            }
            if (seatCounts.some(isNaN)) {
                throw new BadRequestException('Invalid seat numbers provided');
            }
            seatCounts.forEach((seatCount, rowIndex) => {
                for (let seatNumber = 1; seatNumber <= seatCount; seatNumber++) {
                    placesData.push({ row: rowIndex + 1, seatNumber, eventId });
                }
            });
        }
    
        if (placesData.length !== 0) {
            const uniquePlaces = await this.filterExistingPlaces(eventId, placesData);
            if (uniquePlaces.length === 0) {
                throw new BadRequestException('All provided places already exist');
            }
            return await this.createPlaces(uniquePlaces);
        }
    }
    
    private async filterExistingPlaces(eventId: number, places: any[]) {
        const existingPlaces = await this.prisma.places.findMany({
            where: {
                eventId,
                OR: places.map(place => ({
                    row: place.row,
                    seatNumber: place.seatNumber,
                })),
            },
            select: { 
                row: true, 
                seatNumber: true 
            }
        });
    
        const existingSet = new Set(
            existingPlaces.map(place => `${place.row}-${place.seatNumber}`)
        );
    
        return places.filter(
            place => !existingSet.has(`${place.row}-${place.seatNumber}`)
        );
    }
    
    private async createPlaces(places: any[]) {
        return await this.prisma.places.createMany({
            data: places,
            skipDuplicates: true,
        });
    }
    
    async deleteAllPlaces(eventId: number, userId: number){
        const findEvent = await this.eventsService.findOneEvent(eventId)
        if(!findEvent){
            throw new NotFoundException('Company not found') 
        }
        if(findEvent.Companies.userId !== userId){
            throw new ForbiddenException('You can only delete places to your event')
        }
        const deletedPlaces = await this.prisma.places.deleteMany({
            where:{
                eventId
            }
        })
        return deletedPlaces;
    }
    async findOnePlace(eventId: number,placeNumber: number,row:number){
        const place = await this.prisma.places.findFirst({
            where:{
                eventId,
                seatNumber: placeNumber,
                row
            }
        })
        return place;
    }
    async deleteOnePlace(eventId: number,placeNumber: number,row:number, userId: number){
        const findEvent = await this.eventsService.findOneEvent(eventId)
        if(!findEvent){
            throw new NotFoundException('Event not found')
        }
        const findPlace = await this.findOnePlace(eventId,placeNumber,row)
        if(!findPlace){
            throw new NotFoundException('Place not found')
        }
        if(findEvent.Companies.userId !== userId){
            throw new ForbiddenException('You can only delete places to your event')
        }
        const deletedPlaces = await this.prisma.places.delete({
            where:{
                id: findPlace.id
            }
        })
        return deletedPlaces;
    }

    async addOnePlace(eventId: number,placeNumber: number,row:number, userId: number){
        const findEvent = await this.eventsService.findOneEvent(eventId)
        if(!findEvent){
            throw new NotFoundException('Event not found')
        }
        const findAllPlaces = await this.findAllPlaces(eventId)
        if(findEvent.number_of_seats === findAllPlaces.count){
            throw new ForbiddenException('All provided places already exis ')
        }
        const findPlace = await this.findOnePlace(eventId,placeNumber,row)
        if(findPlace){
            throw new BadRequestException('Place already exists')
        }
        if(findEvent.Companies.userId !== userId){
            throw new ForbiddenException('You can only add places to your event')
        }
        const addedPlace = await this.prisma.places.create({
            data:{
                eventId,
                row,
                seatNumber:placeNumber
            }
        })
        return addedPlace;        
    }
}
