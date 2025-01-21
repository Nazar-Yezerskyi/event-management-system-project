import { Test, TestingModule } from '@nestjs/testing';
import { CompanyCategoriesService } from './company-categories.service';

describe('CompanyCategoriesService', () => {
  let service: CompanyCategoriesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CompanyCategoriesService],
    }).compile();

    service = module.get<CompanyCategoriesService>(CompanyCategoriesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
