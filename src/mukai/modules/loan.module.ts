import { PostgresRest } from 'src/common/postgresrest';
import { Module } from '@nestjs/common';
import { LoanController } from '../controllers/loan.controller';
import { LoanService } from '../services/loan.service';

@Module({
  controllers: [LoanController],
  providers: [LoanService, PostgresRest],
})
export class LoanModule {}
