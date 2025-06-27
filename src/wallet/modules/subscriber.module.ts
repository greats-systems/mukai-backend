import { Module } from '@nestjs/common';
import { PostgresRest } from 'src/common/postgresrest';
import { SubscriberController } from 'src/wallet/controllers/subscriber.controller';
import { SubscriberService } from 'src/wallet/services/subscriber.service';
import { SmileWalletService } from '../services/zb_digital_wallet.service';

@Module({
  providers: [PostgresRest, SubscriberService, SmileWalletService],
  controllers: [SubscriberController],
})
export class SubscriberModule { }
