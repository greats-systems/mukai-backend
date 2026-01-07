import { Module } from '@nestjs/common';
import { PostgresRest } from 'src/common/postgresrest';
import { CooperativeMemberApprovalsController } from '../controllers/cooperative-member-approvals.controller';
import { CooperativeMemberApprovalsService } from '../services/cooperative-member-approvals.service';
import { WalletModule } from './wallet.module';
import { SmileCashWalletModule } from 'src/common/zb_smilecash_wallet/modules/smilecash-wallet.module';
import { LoanModule } from './loan.module';
import { TransactionModule } from './transaction.module';

@Module({
  imports: [WalletModule, SmileCashWalletModule, LoanModule, TransactionModule],
  controllers: [CooperativeMemberApprovalsController],
  providers: [CooperativeMemberApprovalsService, PostgresRest],
})
export class CooperativeMemberApprovalsModule {}
