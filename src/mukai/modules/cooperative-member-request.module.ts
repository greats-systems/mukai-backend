import { Module } from '@nestjs/common';
import { CooperativeMemberRequestsController } from '../controllers/cooperative_member_requests.controller';
import { CooperativeMemberRequestsService } from '../services/cooperative_member_requests.service';
import { PostgresRest } from 'src/common/postgresrest';

@Module({
  controllers: [CooperativeMemberRequestsController],
  providers: [CooperativeMemberRequestsService, PostgresRest],
})
export class CooperativeMemberRequestModule {}
