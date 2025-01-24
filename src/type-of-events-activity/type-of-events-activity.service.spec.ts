import { Test, TestingModule } from '@nestjs/testing';
import { TypeOfEventsActivityService } from './type-of-events-activity.service';

describe('TypeOfEventsActivityService', () => {
  let service: TypeOfEventsActivityService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TypeOfEventsActivityService],
    }).compile();

    service = module.get<TypeOfEventsActivityService>(TypeOfEventsActivityService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
