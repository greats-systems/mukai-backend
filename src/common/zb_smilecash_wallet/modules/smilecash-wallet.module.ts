import { Module } from '@nestjs/common';
import { SmileCashWalletController } from '../controllers/smilecash-wallet.controller';
import { SmileCashWalletService } from '../services/smilecash-wallet.service';
import { PostgresRest } from 'src/common/postgresrest';

@Module({
  exports: [SmileCashWalletService],
  controllers: [SmileCashWalletController],
  providers: [SmileCashWalletService, PostgresRest],
})
export class SmileCashWalletModule {}
