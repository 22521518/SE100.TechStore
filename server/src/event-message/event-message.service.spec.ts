import { Test, TestingModule } from '@nestjs/testing';
import { EventMessageService } from './event-message.service';

describe('EventMessageService', () => {
  let service: EventMessageService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EventMessageService],
    }).compile();

    service = module.get<EventMessageService>(EventMessageService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
