import { Test, TestingModule } from '@nestjs/testing';
import { ZaloPaymentService } from './zalo-payment.service';

describe('ZaloPaymentService', () => {
  let service: ZaloPaymentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ZaloPaymentService],
    }).compile();

    service = module.get<ZaloPaymentService>(ZaloPaymentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
