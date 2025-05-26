import { PartialType } from '@nestjs/swagger';
import { CreateProviderDto } from '../create/create-provider.dto';

export class UpdateProviderDto extends PartialType(CreateProviderDto) {}
