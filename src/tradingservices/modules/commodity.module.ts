import { Module } from '@nestjs/common';
import { CommodityController } from '../controllers/commodity.controller';
import { PostgresRest } from 'src/common/postgresrest';
import { CommodityService } from '../services/commodity.service';

@Module({
  controllers: [CommodityController],
  providers: [CommodityService, PostgresRest],
})
export class CommodityModule {}
