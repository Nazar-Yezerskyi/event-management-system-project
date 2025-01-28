import { Test, TestingModule } from '@nestjs/testing';
import { TypeOfEventsActivityController } from './type-of-events-activity.controller';

describe('TypeOfEventsActivityController', () => {
  let controller: TypeOfEventsActivityController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TypeOfEventsActivityController],
    }).compile();

    controller = module.get<TypeOfEventsActivityController>(TypeOfEventsActivityController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
