import { Test, TestingModule } from '@nestjs/testing';
import { NewsSubscriptionService } from './news-subscription.service';

describe('NewsSubscriptionService', () => {
  let service: NewsSubscriptionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NewsSubscriptionService],
    }).compile();

    service = module.get<NewsSubscriptionService>(NewsSubscriptionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
