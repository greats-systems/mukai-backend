import { Module } from '@nestjs/common';
import { TransactionsController } from '../controllers/transactions.controller';
import { TransactionsService } from '../services/transactions.service';
import { PostgresRestHandlerModule } from 'src/common/postgresrest';
import { WalletModule } from './wallet.module';
import { SmileCashWalletService } from 'src/common/zb_smilecash_wallet/services/smilecash-wallet.service';

@Module({
  imports: [PostgresRestHandlerModule, WalletModule],
  controllers: [TransactionsController],
  providers: [
    TransactionsService,
    SmileCashWalletService, // ✅ Provide directly
  ],
  exports: [TransactionsService],
})
export class TransactionModule {}
