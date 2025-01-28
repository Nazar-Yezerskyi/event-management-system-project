import { Test, TestingModule } from '@nestjs/testing';
import { EventsTypeService } from './events-type.service';

describe('EventsTypeService', () => {
  let service: EventsTypeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EventsTypeService],
    }).compile();

    service = module.get<EventsTypeService>(EventsTypeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
