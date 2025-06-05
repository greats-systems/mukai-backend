import { PartialType } from '@nestjs/swagger';
import { CreateOrganizationDto } from '../create/create-organization.dto';

export class UpdateOrganizationDto extends PartialType(CreateOrganizationDto) {}
