import { Test, TestingModule } from '@nestjs/testing';
import { TradingservicesController } from './tradingservices.controller';
import { TradingservicesService } from '../services/tradingservices.service';

describe('TradingservicesController', () => {
  let controller: TradingservicesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TradingservicesController],
      providers: [TradingservicesService],
    }).compile();

    controller = module.get<TradingservicesController>(
      TradingservicesController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
