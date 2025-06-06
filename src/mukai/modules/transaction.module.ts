import { Module } from '@nestjs/common';
import { TransactionsController } from '../controllers/transactions.controller';
import { TransactionsService } from '../services/transactions.service';
import { PostgresRest } from 'src/common/postgresrest';

@Module({
  controllers: [TransactionsController],
  providers: [TransactionsService, PostgresRest],
})
export class TransactionModule {}
