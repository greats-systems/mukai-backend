import { Module } from '@nestjs/common';
import { PostgresRest } from 'src/common/postgresrest';
import { SmilePayService } from '../services/smilepay.service';
import { SmilePayController } from '../controllers/smilepay.controller';

@Module({
  exports: [SmilePayService],
  controllers: [SmilePayController],
  providers: [SmilePayService, PostgresRest],
})
export class SmilePayModule {}
