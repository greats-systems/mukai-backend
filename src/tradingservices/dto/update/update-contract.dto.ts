import { PartialType } from '@nestjs/swagger';
import { CreateContractDto } from '../create/create-contract.dto';

export class UpdateContractDto extends PartialType(CreateContractDto) {}
