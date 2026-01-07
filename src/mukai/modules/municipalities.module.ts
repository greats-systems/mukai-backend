import { Module } from '@nestjs/common';

import { PostgresRest } from 'src/common/postgresrest';
import { MunicipalitiesController } from '../controllers/municipalities.controller';
import { MunicipalitiesService } from '../services/pay-municipality.service';

@Module({
  controllers: [MunicipalitiesController],
  providers: [MunicipalitiesService, PostgresRest],
})
export class MunicipalitiesModule {}
