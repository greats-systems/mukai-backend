import * as common from '@nestjs/common';
import * as LedgerService from './ledger.service';
import * as LedgerController from './ledger.controller';
import { PostgresRest } from 'src/common/postgresrest';

@common.Module({
  controllers: [
    LedgerController.CommodityController,
    LedgerController.ContractBidController,
    LedgerController.ContractController,
    LedgerController.ProducerController,
    LedgerController.ProviderController,
    LedgerController.ProviderProductsController,
    LedgerController.ProviderServicesController,
    LedgerController.TraderController,
    LedgerController.TraderInventoryController,
    LedgerController.TestController,
  ],
  providers: [
    LedgerService.CommodityService,
    LedgerService.ContractBidService,
    LedgerService.ContractService,
    LedgerService.ProducerService,
    LedgerService.ProviderProductsService,
    LedgerService.ProviderService,
    LedgerService.ProviderServicesService,
    LedgerService.TraderInventoryService,
    LedgerService.TraderService,
    PostgresRest,
  ],
  exports: [
    LedgerService.CommodityService,
    LedgerService.ContractBidService,
    LedgerService.ContractService,
    LedgerService.ProducerService,
    LedgerService.ProviderProductsService,
    LedgerService.ProviderService,
    LedgerService.ProviderServicesService,
    LedgerService.TraderInventoryService,
    LedgerService.TraderService,
  ],
})
export class LedgerModule {}
