import { PartialType } from '@nestjs/swagger';
import { CreateCooperativeMemberRequestDto } from '../create/create-cooperative-member-request.dto';

export class UpdateCooperativeMemberRequestDto extends PartialType(
  CreateCooperativeMemberRequestDto,
) {}
