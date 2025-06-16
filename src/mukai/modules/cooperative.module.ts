import { Module } from '@nestjs/common';
import { CooperativesController } from '../controllers/cooperatives.controller';
import { CooperativesService } from '../services/cooperatives.service';
import { PostgresRest } from 'src/common/postgresrest';

@Module({
  controllers: [CooperativesController],
  providers: [CooperativesService, PostgresRest],
})
export class CooperativeModule {}
