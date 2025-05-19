import { PartialType } from '@nestjs/swagger';
import * as CreateLedgerDto from './create-ledger.dto';

export class UpdateContractBidDto extends PartialType(
  CreateLedgerDto.CreateContractBidDto,
) {}

export class UpdateContractDto extends PartialType(
  CreateLedgerDto.CreateContractDto,
) {}

export class UpdateProviderProductsDto extends PartialType(
  CreateLedgerDto.CreateProviderProductsDto,
) {}

export class UpdateProviderServicesDto extends PartialType(
  CreateLedgerDto.CreateProviderServicesDto,
) {}

export class UpdateProviderDto extends PartialType(
  CreateLedgerDto.CreateProviderDto,
) {}

export class UpdateTraderInventoryDto extends PartialType(
  CreateLedgerDto.CreateTraderInventoryDto,
) {}
