import { PartialType } from '@nestjs/swagger';
import { CreateTransactionDto } from '../create/create-transaction.dto';

export class UpdateTransactionDto extends PartialType(CreateTransactionDto) {}
