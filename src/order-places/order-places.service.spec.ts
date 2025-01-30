import { Test, TestingModule } from '@nestjs/testing';
import { OrderPlacesService } from './order-places.service';

describe('OrderPlacesService', () => {
  let service: OrderPlacesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OrderPlacesService],
    }).compile();

    service = module.get<OrderPlacesService>(OrderPlacesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
