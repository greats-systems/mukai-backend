import { PartialType } from '@nestjs/swagger';
import { CreateEmployeeDto } from '../create/create-employee.dto';

export class UpdateEmployeeDto extends PartialType(CreateEmployeeDto) {}
