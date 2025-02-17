import { Test, TestingModule } from '@nestjs/testing';
import { SurveyOptionsService } from './survey-options.service';

describe('SurveyOptionsService', () => {
  let service: SurveyOptionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SurveyOptionsService],
    }).compile();

    service = module.get<SurveyOptionsService>(SurveyOptionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
