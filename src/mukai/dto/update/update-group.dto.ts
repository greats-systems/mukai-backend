import { PartialType } from '@nestjs/swagger';
import { CreateGroupDto } from '../create/create-group.dto';

export class UpdateGroupDto extends PartialType(CreateGroupDto) {}
