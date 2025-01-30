import { Test, TestingModule } from '@nestjs/testing';
import { OrderPlacesController } from './order-places.controller';

describe('OrderPlacesController', () => {
  let controller: OrderPlacesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrderPlacesController],
    }).compile();

    controller = module.get<OrderPlacesController>(OrderPlacesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
