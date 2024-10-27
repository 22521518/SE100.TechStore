import { Test, TestingModule } from '@nestjs/testing';
import { CustomerInboxController } from './customer-inbox.controller';

describe('CustomerInboxController', () => {
  let controller: CustomerInboxController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CustomerInboxController],
    }).compile();

    controller = module.get<CustomerInboxController>(CustomerInboxController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
