import { PostgresRest } from 'src/common/postgresrest';
import { Module } from '@nestjs/common';
import { LoanController } from '../controllers/loan.controller';
import { LoanService } from '../services/loan.service';
import { TransactionModule } from './transaction.module';
import { SmileCashWalletModule } from 'src/common/zb_smilecash_wallet/modules/smilecash-wallet.module';

@Module({
  imports: [TransactionModule, SmileCashWalletModule],
  controllers: [LoanController],
  providers: [LoanService, PostgresRest],
  exports: [LoanService],
})
export class LoanModule {}
