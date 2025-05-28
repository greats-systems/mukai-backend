import { PartialType } from '@nestjs/swagger';
import { CreateContractBidDto } from '../create/create-contract-bid.dto';

export class UpdateContractBidDto extends PartialType(CreateContractBidDto) {}
