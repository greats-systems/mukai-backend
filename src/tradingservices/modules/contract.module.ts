import { Module } from '@nestjs/common';
import { ContractController } from '../controllers/contract.controller';
import { PostgresRest } from 'src/common/postgresrest';
import { ContractService } from '../services/contracts.service';

@Module({
  controllers: [ContractController],
  providers: [ContractService, PostgresRest],
})
export class ContractModule {}
