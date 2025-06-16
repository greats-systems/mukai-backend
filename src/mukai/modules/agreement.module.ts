import { Module } from '@nestjs/common';
import { AgreementsController } from '../controllers/agreements.controller';
import { AgreementsService } from '../services/agreements.service';
import { PostgresRest } from 'src/common/postgresrest';

@Module({
  controllers: [AgreementsController],
  providers: [AgreementsService, PostgresRest],
})
export class AgreementModule {}
