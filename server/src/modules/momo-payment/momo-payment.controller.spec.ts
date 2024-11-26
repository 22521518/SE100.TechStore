import { Test, TestingModule } from '@nestjs/testing';
import { MomoPaymentController } from './momo-payment.controller';
import { MomoPaymentService } from './momo-payment.service';

describe('MomoPaymentController', () => {
  let controller: MomoPaymentController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MomoPaymentController],
      providers: [MomoPaymentService],
    }).compile();

    controller = module.get<MomoPaymentController>(MomoPaymentController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
