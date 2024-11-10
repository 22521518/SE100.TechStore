import { Test, TestingModule } from '@nestjs/testing';
import { ImportationsService } from './importations.service';

describe('ImportationsService', () => {
  let service: ImportationsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ImportationsService],
    }).compile();

    service = module.get<ImportationsService>(ImportationsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
