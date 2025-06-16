import { Module } from '@nestjs/common';
import { SpendingConditionsController } from '../controllers/spending-conditions.controller';
import { SpendingConditionsService } from '../services/spending-conditions.service';
import { PostgresRest } from 'src/common/postgresrest';

@Module({
  providers: [SpendingConditionsService, PostgresRest],
  controllers: [SpendingConditionsController],
})
export class SpendingConditionsModule {}
