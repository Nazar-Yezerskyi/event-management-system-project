import { Test, TestingModule } from '@nestjs/testing';
import { OrderTicketService } from './order-ticket.service';

describe('OrderTicketService', () => {
  let service: OrderTicketService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OrderTicketService],
    }).compile();

    service = module.get<OrderTicketService>(OrderTicketService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
