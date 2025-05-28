import { Module } from '@nestjs/common';
import { TraderController } from '../controllers/trader.controller';
import { TraderService } from '../services/trader.service';
import { PostgresRest } from 'src/common/postgresrest';

@Module({
  controllers: [TraderController],
  providers: [TraderService, PostgresRest],
})
export class TraderModule {}
