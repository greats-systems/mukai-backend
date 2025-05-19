import { Test, TestingModule } from '@nestjs/testing';
import { MessagingsGateway } from './messagings.gateway';
import { MessagingsService } from './messagings.service';

describe('MessagingsGateway', () => {
  let gateway: MessagingsGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MessagingsGateway, MessagingsService],
    }).compile();

    gateway = module.get<MessagingsGateway>(MessagingsGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
