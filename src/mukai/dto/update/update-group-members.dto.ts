import { PartialType } from '@nestjs/swagger';
import { CreateGroupMemberDto } from '../create/create-group-members.dto';

export class UpdateGroupMemberDto extends PartialType(CreateGroupMemberDto) {}
