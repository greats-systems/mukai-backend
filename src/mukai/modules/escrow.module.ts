import { Module } from '@nestjs/common';
import { PostgresRest } from 'src/common/postgresrest';
import { EscrowController } from '../controllers/escrow.controller';
import { EscrowService } from '../services/escrow.service';

@Module({
  controllers: [EscrowController],
  providers: [EscrowService, PostgresRest],
})
export class EscrowModule {}
