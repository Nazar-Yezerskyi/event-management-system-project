import { Test, TestingModule } from '@nestjs/testing';
import { EventsTypeController } from './events-type.controller';

describe('EventsTypeController', () => {
  let controller: EventsTypeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EventsTypeController],
    }).compile();

    controller = module.get<EventsTypeController>(EventsTypeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
