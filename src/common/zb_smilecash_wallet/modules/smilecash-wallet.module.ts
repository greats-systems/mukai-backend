import { Module } from '@nestjs/common';
import { SmileCashWalletController } from '../controllers/smilecash-wallet.controller';
import { SmileCashWalletService } from '../services/smilecash-wallet.service';
import {
  PostgresRest,
  PostgresRestHandlerModule,
} from 'src/common/postgresrest';

@Module({
  imports: [PostgresRestHandlerModule],
  exports: [SmileCashWalletService],
  controllers: [SmileCashWalletController],
  providers: [SmileCashWalletService, PostgresRest],
})
export class SmileCashWalletModule {}
