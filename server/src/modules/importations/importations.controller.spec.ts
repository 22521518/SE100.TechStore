import { Test, TestingModule } from '@nestjs/testing';
import { ImportationsController } from './importations.controller';
import { ImportationsService } from './importations.service';

describe('ImportationsController', () => {
  let controller: ImportationsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ImportationsController],
      providers: [ImportationsService],
    }).compile();

    controller = module.get<ImportationsController>(ImportationsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
