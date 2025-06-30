import { Module } from '@nestjs/common';
import { CooperativesController } from '../controllers/cooperatives.controller';
import { CooperativesService } from '../services/cooperatives.service';
import { PostgresRest } from 'src/common/postgresrest';
import { SmileWalletService } from 'src/wallet/services/zb_digital_wallet.service';

@Module({
  controllers: [CooperativesController],
  providers: [CooperativesService, PostgresRest, SmileWalletService],
})
export class CooperativeModule { }
