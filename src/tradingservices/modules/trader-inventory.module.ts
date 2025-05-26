import { Module } from '@nestjs/common';
import { TraderInventoryService } from '../services/trader-inventory.service';
import { TraderInventoryController } from '../controllers/trader-inventory.controller';
import { PostgresRest } from 'src/common/postgresrest';

@Module({
  controllers: [TraderInventoryController],
  providers: [TraderInventoryService, PostgresRest],
})
export class TraderInventoryModule {}
