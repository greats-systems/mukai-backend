import { Module } from '@nestjs/common';
import { PostgresRestHandlerModule } from 'src/common/postgresrest';
import { SmileCashWalletService } from 'src/common/zb_smilecash_wallet/services/smilecash-wallet.service';
import { WalletsService } from '../services/wallets.service';

@Module({
  imports: [PostgresRestHandlerModule],
  providers: [SmileCashWalletService, WalletsService],
  exports: [SmileCashWalletService, WalletsService],
})
export class SharedServicesModule {}
