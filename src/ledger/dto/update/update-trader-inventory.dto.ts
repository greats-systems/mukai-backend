import { PartialType } from '@nestjs/swagger';
import { CreateTraderInventoryDto } from '../create/create-trader-inventory.dto';

export class UpdateTraderInventoryDto extends PartialType(
  CreateTraderInventoryDto,
) {}
