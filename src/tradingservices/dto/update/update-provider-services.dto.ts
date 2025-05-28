import { PartialType } from '@nestjs/swagger';
import { CreateProviderServicesDto } from '../create/create-provider-services.dto';

export class UpdateProviderServicesDto extends PartialType(
  CreateProviderServicesDto,
) {}
