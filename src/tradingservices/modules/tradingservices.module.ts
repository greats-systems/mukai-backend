import { Module } from '@nestjs/common';
import { TradingservicesController } from '../controllers/tradingservices.controller';
import { TradingservicesService } from '../services/tradingservices.service';
import { PostgresRest } from 'src/common/postgresrest';

@Module({
  controllers: [TradingservicesController],
  providers: [PostgresRest, TradingservicesService],
})
export class TradingservicesModule {}
