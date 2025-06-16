import { PartialType } from '@nestjs/swagger';
import { CreateEscrowDto } from '../create/create-escrow.dto';

export class UpdateEscrowDto extends PartialType(CreateEscrowDto) {}
