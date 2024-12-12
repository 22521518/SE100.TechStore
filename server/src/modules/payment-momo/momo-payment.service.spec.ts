import { Test, TestingModule } from '@nestjs/testing';
import { MomoPaymentService } from './momo-payment.service';

describe('MomoPaymentService', () => {
  let service: MomoPaymentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MomoPaymentService],
    }).compile();

    service = module.get<MomoPaymentService>(MomoPaymentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
