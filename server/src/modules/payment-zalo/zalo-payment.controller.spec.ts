import { Test, TestingModule } from '@nestjs/testing';
import { ZaloPaymentController } from './zalo-payment.controller';
import { ZaloPaymentService } from './zalo-payment.service';

describe('ZaloPaymentController', () => {
  let controller: ZaloPaymentController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ZaloPaymentController],
      providers: [ZaloPaymentService],
    }).compile();

    controller = module.get<ZaloPaymentController>(ZaloPaymentController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
