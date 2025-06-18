import { Module } from '@nestjs/common';
import { PostgresRest } from 'src/common/postgresrest';
import { WalletTransactionService } from '../services/wallet-transaction.service';
import { WalletTransactionController } from '../controllers/wallet-transaction.controller';

@Module({
  providers: [PostgresRest, WalletTransactionService],
  controllers: [WalletTransactionController],
})
export class WalletTransactionModule {}
