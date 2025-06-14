import { PartialType } from '@nestjs/swagger';
import { CreateCooperativeMemberApprovalsDto } from '../create/create-cooperative-member-approvals.dto';

export class UpdateCooperativeMemberApprovalsDto extends PartialType(
  CreateCooperativeMemberApprovalsDto,
) {}
