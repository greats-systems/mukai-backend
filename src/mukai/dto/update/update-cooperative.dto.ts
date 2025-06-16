import { PartialType } from '@nestjs/swagger';
import { CreateCooperativeDto } from '../create/create-cooperative.dto';

export class UpdateCooperativeDto extends PartialType(CreateCooperativeDto) {}
