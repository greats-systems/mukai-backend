import { PostgresRest } from 'src/common/postgresrest';
import { GroupsController } from '../controllers/group.controller';
import { GroupService } from '../services/group.service';
import { Module } from '@nestjs/common';
import { SmileWalletService } from 'src/wallet/services/zb_digital_wallet.service';
import { SmileCashWalletModule } from 'src/common/zb_smilecash_wallet/modules/smilecash-wallet.module';
import { TransactionModule } from './transaction.module';
import { WalletModule } from './wallet.module';

@Module({
  imports: [SmileCashWalletModule, TransactionModule, WalletModule],
  controllers: [GroupsController],
  providers: [GroupService, PostgresRest, SmileWalletService],
})
export class GroupModule {}
