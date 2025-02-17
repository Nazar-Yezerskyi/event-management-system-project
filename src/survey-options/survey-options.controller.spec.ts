import { Test, TestingModule } from '@nestjs/testing';
import { SurveyOptionsController } from './survey-options.controller';

describe('SurveyOptionsController', () => {
  let controller: SurveyOptionsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SurveyOptionsController],
    }).compile();

    controller = module.get<SurveyOptionsController>(SurveyOptionsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
