import { Test, TestingModule } from '@nestjs/testing';
import { CloudinaryDbService } from './cloudinary-db.service';

describe('CloudinaryDbService', () => {
  let service: CloudinaryDbService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CloudinaryDbService],
    }).compile();

    service = module.get<CloudinaryDbService>(CloudinaryDbService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
