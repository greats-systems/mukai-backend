import { Module } from '@nestjs/common';
import { WalletsController } from '../controllers/wallets.controller';
import { WalletsService } from '../services/wallets.service';
import { PostgresRest } from 'src/common/postgresrest';

@Module({
  controllers: [WalletsController],
  providers: [WalletsService, PostgresRest],
})
export class WalletModule {}
