import { Test, TestingModule } from '@nestjs/testing';
import { MessagingsService } from './messagings.service';

describe('MessagingsService', () => {
  let service: MessagingsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MessagingsService],
    }).compile();

    service = module.get<MessagingsService>(MessagingsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
