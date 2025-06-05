import { PartialType } from '@nestjs/swagger';
import { CreateTradingserviceDto } from '../create/create-tradingservice.dto';

export class UpdateTradingserviceDto extends PartialType(
  CreateTradingserviceDto,
) {}
