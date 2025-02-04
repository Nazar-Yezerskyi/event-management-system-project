import { Controller, Get, Param } from '@nestjs/common';
import { OrderPlacesService } from './order-places.service';

@Controller('order-places')
export class OrderPlacesController {
    constructor(private orderPlace: OrderPlacesService){}
}
