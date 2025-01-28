import { Test, TestingModule } from '@nestjs/testing';
import { NewsSubscriptionController } from './news-subscription.controller';

describe('NewsSubscriptionController', () => {
  let controller: NewsSubscriptionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NewsSubscriptionController],
    }).compile();

    controller = module.get<NewsSubscriptionController>(NewsSubscriptionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
