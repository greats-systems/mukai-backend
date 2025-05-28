import { Module } from '@nestjs/common';
import { ContractBidController } from '../controllers/contract-bid.controller';
import { PostgresRest } from 'src/common/postgresrest';
import { ContractBidService } from '../services/contract-bidding.service';

@Module({
  controllers: [ContractBidController],
  providers: [ContractBidService, PostgresRest],
})
export class ContractBidModule {}
