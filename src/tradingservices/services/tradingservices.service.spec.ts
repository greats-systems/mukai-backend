import { Test, TestingModule } from '@nestjs/testing';
import { TradingservicesService } from './tradingservices.service';

describe('TradingservicesService', () => {
  let service: TradingservicesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TradingservicesService],
    }).compile();

    service = module.get<TradingservicesService>(TradingservicesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
