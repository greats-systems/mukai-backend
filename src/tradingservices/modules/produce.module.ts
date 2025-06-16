import { Module } from '@nestjs/common';
import { PostgresRest } from 'src/common/postgresrest';
import { ProduceService } from '../services/produce.service';
import { ProduceController } from '../controllers/produce.controller';
import { ProduceChainCodeService } from 'src/nodes/produce_chaincode_api.service';

@Module({
  controllers: [ProduceController],
  providers: [ProduceService, ProduceChainCodeService, PostgresRest],
})
export class ProduceModule {}
