import { Module } from '@nestjs/common';
import { TradingservicesService } from './tradingservices.service';
import { TradingservicesController } from './tradingservices.controller';
import { CommodityService } from './commodity.service';
import { ContractBidService } from './contract-bidding.service';
import { ContractService } from './contracts.service';
import { ProducerService } from './producers.service';
import { ProviderProductsService } from './provider-products.service';
import { ProviderServicesService } from './provider-services.service';
import { ProviderService } from './providers.service';
import { TraderInventoryService } from './trader-inventory.service';
import { TraderService } from './trader.service';

@Module({
  controllers: [TradingservicesController],
  providers: [TradingservicesService,
    CommodityService,
    ContractBidService,
    ContractService,
    ProducerService,
    ProviderProductsService,
    ProviderService,
    ProviderServicesService,
    TraderInventoryService,
    TraderService,
  ],
})
export class TradingservicesModule { }
