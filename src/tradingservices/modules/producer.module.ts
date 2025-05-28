import { Module } from '@nestjs/common';
import { ProducerController } from '../controllers/producer.controller';
import { PostgresRest } from 'src/common/postgresrest';
import { ProducerService } from '../services/producers.service';

@Module({
  controllers: [ProducerController],
  providers: [ProducerService, PostgresRest],
})
export class ProducerModule {}
