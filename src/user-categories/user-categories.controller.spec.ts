import { Test, TestingModule } from '@nestjs/testing';
import { UserCategoriesController } from './user-categories.controller';

describe('UserCategoriesController', () => {
  let controller: UserCategoriesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserCategoriesController],
    }).compile();

    controller = module.get<UserCategoriesController>(UserCategoriesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
