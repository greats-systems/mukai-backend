import { PartialType } from '@nestjs/swagger';
import { CreateAgreementDto } from '../create/create-agreement.dto';

export class UpdateAgreementDto extends PartialType(CreateAgreementDto) {}
