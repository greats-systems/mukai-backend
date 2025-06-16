import { PartialType } from '@nestjs/swagger';
import { CreateLoanDto } from '../create/create-loan.dto';

export class UpdateLoanDto extends PartialType(CreateLoanDto) {}
