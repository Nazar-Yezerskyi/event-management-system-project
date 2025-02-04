import { Test, TestingModule } from '@nestjs/testing';
import { OrderTicketController } from './order-ticket.controller';

describe('OrderTicketController', () => {
  let controller: OrderTicketController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrderTicketController],
    }).compile();

    controller = module.get<OrderTicketController>(OrderTicketController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
