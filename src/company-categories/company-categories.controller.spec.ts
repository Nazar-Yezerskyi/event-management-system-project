import { Test, TestingModule } from '@nestjs/testing';
import { CompanyCategoriesController } from './company-categories.controller';

describe('CompanyCategoriesController', () => {
  let controller: CompanyCategoriesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CompanyCategoriesController],
    }).compile();

    controller = module.get<CompanyCategoriesController>(CompanyCategoriesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
