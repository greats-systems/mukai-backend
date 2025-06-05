import { PartialType } from '@nestjs/swagger';
import { CreateWalletDto } from '../create/create-wallet.dto';

export class UpdateWalletDto extends PartialType(CreateWalletDto) {}
