import { Module } from '@nestjs/common';
import { WalletsController } from '../controllers/wallets.controller';
import { WalletsService } from '../services/wallets.service';
import { PostgresRest } from 'src/common/postgresrest';
import { SmileWalletService } from 'src/wallet/services/zb_digital_wallet.service';
import { SavingsController } from '../controllers/savings.controller';
import { SavingsService } from '../services/savings.service';

@Module({
  controllers: [WalletsController, SavingsController],
  providers: [WalletsService, PostgresRest, SmileWalletService, SavingsService],
})
export class WalletModule { }
