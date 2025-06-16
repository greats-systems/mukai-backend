import { Module } from '@nestjs/common';
import { TransactionsController } from '../controllers/transactions.controller';
import { TransactionsService } from '../services/transactions.service';
import { PostgresRest } from 'src/common/postgresrest';
import { WalletsService } from '../services/wallets.service';

@Module({
  controllers: [TransactionsController],
  providers: [TransactionsService, WalletsService, PostgresRest],
})
export class TransactionModule {}
