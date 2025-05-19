import { PartialType } from '@nestjs/swagger';
import { CreateBusinessDto, CreateOrganizationDto } from './create-organization.dto';

export class UpdateOrganizationDto extends PartialType(CreateOrganizationDto) { }
export class UpdateBusinessDto extends PartialType(CreateBusinessDto) { }
