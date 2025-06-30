import { PostgresRest } from 'src/common/postgresrest';
import { GroupsController } from '../controllers/group.controller';
import { GroupService } from '../services/group.service';
import { Module } from '@nestjs/common';
import { SmileWalletService } from 'src/wallet/services/zb_digital_wallet.service';

@Module({
  controllers: [GroupsController],
  providers: [GroupService, PostgresRest, SmileWalletService],
})
export class GroupModule {}
