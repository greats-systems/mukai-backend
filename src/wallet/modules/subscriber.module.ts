import { Module } from '@nestjs/common';
import { PostgresRest } from 'src/common/postgresrest';
import { SubscriberController } from 'src/wallet/controllers/subscriber.controller';
import { SubscriberService } from 'src/wallet/services/subscriber.service';

@Module({
  providers: [PostgresRest, SubscriberService],
  controllers: [SubscriberController],
})
export class SubscriberModule {}
