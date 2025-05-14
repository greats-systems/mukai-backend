import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import * as LedgerService from './ledger.service';
import { CreateCommodityDto } from './dto/create/create-commodity.dto';
import { CreateContractBidDto } from './dto/create/create-contract-bid.dto';
import { UpdateContractBidDto } from './dto/update/update-contract-bid.dto';
import { CreateContractDto } from './dto/create/create-contract.dto';
import { CreateProviderDto } from './dto/create/create-provider.dto';
import { CreateProviderProductsDto } from './dto/create/create-provider-products.dto';
import { CreateProviderServicesDto } from './dto/create/create-provider-services.dto';
import { CreateTraderDto } from './dto/create/create-trader.dto';
import { CreateTraderInventoryDto } from './dto/create/create-trader-inventory.dto';
import { UpdateTraderInventoryDto } from './dto/update/update-trader-inventory.dto';
import { UpdateContractDto } from './dto/update/update-contract.dto';
import { CreateProducerDto } from './dto/create/create-producer.dto';

@Controller('commodity')
export class CommodityController {
  constructor(
    private readonly commodityService: LedgerService.CommodityService,
  ) {}
  @Post()
  create(@Body() createCommodityDto: CreateCommodityDto) {
    return this.commodityService.createCommodity(createCommodityDto);
  }
}
