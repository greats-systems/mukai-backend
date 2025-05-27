import { PartialType } from '@nestjs/swagger';
import { CreateProviderProductsDto } from '../create/create-provider-products.dto';

export class UpdateProviderProductsDto extends PartialType(
  CreateProviderProductsDto,
) {}
