import { PartialType } from '@nestjs/swagger';
import { CreateSpendingConditionsDto } from '../create/create-spending-conditions.dto';

export class UpdateSpendingConditionsDto extends PartialType(
  CreateSpendingConditionsDto,
) {}
