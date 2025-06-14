import { Module } from '@nestjs/common';
import { PostgresRest } from 'src/common/postgresrest';
import { CooperativeMemberApprovalsController } from '../controllers/cooperative-member-approvals.controller';
import { CooperativeMemberApprovalsService } from '../services/cooperative-member-approvals.service';

@Module({
  controllers: [CooperativeMemberApprovalsController],
  providers: [CooperativeMemberApprovalsService, PostgresRest],
})
export class CooperativeMemberApprovalsModule {}
