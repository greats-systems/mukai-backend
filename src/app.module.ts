import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
<<<<<<< Updated upstream

import { PostgresRestHandlerModule } from './common/postgresrest';
import { OrdersModule } from './orders/orders.module';
import { MessagingsModule } from './messagings/messagings.module';
import { NodesModule } from './nodes/nodes.module';
=======
import {
  // PostgresRestHandlerGuard,
  PostgresRestHandlerModule,
} from './common/postgresrest';
// import { APP_GUARD } from '@nestjs/core';
// import { InventoriesModule } from './inventories/inventories.module';
>>>>>>> Stashed changes
import { CommodityController } from './tradingservices/controllers/commodity.controller';
import { ContractBidController } from './tradingservices/controllers/contract-bid.controller';
import { ContractController } from './tradingservices/controllers/contract.controller';
import { ProducerController } from './tradingservices/controllers/producer.controller';
import { ProviderController } from './tradingservices/controllers/provider.controller';
import { ProviderProductsController } from './tradingservices/controllers/provider-products.controller';
import { ProviderServicesController } from './tradingservices/controllers/provider-services.controller';
<<<<<<< Updated upstream
import { TradingservicesController } from './tradingservices/controllers/tradingservices.controller';
import { TraderInventoryController } from './tradingservices/controllers/trader-inventory.controller';
import { TradingservicesModule } from './tradingservices/modules/tradingservices.module';
=======
import { TraderController } from './tradingservices/controllers/trader.controller';
import { TraderInventoryController } from './tradingservices/controllers/trader-inventory.controller';
>>>>>>> Stashed changes
import { CommodityModule } from './tradingservices/modules/commodity.module';
import { ContractBidModule } from './tradingservices/modules/contract-bid.module';
import { ContractModule } from './tradingservices/modules/contract.module';
import { ProducerModule } from './tradingservices/modules/producer.module';
import { ProviderModule } from './tradingservices/modules/provider.module';
import { ProviderProductsModule } from './tradingservices/modules/provider-products.module';
import { ProviderServicesModule } from './tradingservices/modules/provider-services.module';
<<<<<<< Updated upstream
import { TraderInventoryService } from './tradingservices/services/trader-inventory.service';
import { CommodityService } from './tradingservices/services/commodity.service';
import { ContractBidService } from './tradingservices/services/contract-bidding.service';
import { ContractService } from './tradingservices/services/contracts.service';
import { ProducerService } from './tradingservices/services/producers.service';
import { ProviderProductsService } from './tradingservices/services/provider-products.service';
import { ProviderService } from './tradingservices/services/provider.service';
import { ProviderServicesService } from './tradingservices/services/provider-services.service';
import { TradingservicesService } from './tradingservices/services/tradingservices.service';
=======
import { TraderModule } from './tradingservices/modules/trader.module';
import { TraderInventoryModule } from './tradingservices/modules/trader-inventory.module';
import { ProviderService } from './tradingservices/services/provider.service';
import { CommodityService } from './tradingservices/services/commodity.service';
import { ContractBidService } from './tradingservices/services/contract-bid.service';
import { ContractService } from './tradingservices/services/contract.service';
import { ProducerService } from './tradingservices/services/producer.service';
import { ProviderProductsService } from './tradingservices/services/provider-products.service';
import { ProviderServicesService } from './tradingservices/services/provider-services.service';
import { TraderService } from './tradingservices/services/trader.service';
import { TraderInventoryService } from './tradingservices/services/trader-inventory.service';
>>>>>>> Stashed changes

@Module({
  imports: [
    PostgresRestHandlerModule,
    AuthModule,
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    UserModule,
<<<<<<< Updated upstream
    OrdersModule,
    MessagingsModule,
    NodesModule,
=======
    // LedgerModule,
    // OrdersModule,
    // MessagingsModule,
    // NodesModule,
>>>>>>> Stashed changes
    CommodityModule,
    ContractBidModule,
    ContractModule,
    ProducerModule,
    ProviderModule,
    ProviderProductsModule,
    ProviderServicesModule,
<<<<<<< Updated upstream
    TradingservicesModule,
=======
    TraderModule,
    TraderInventoryModule,
    // TradingservicesModule,
>>>>>>> Stashed changes
  ],
  controllers: [
    AppController,
    CommodityController,
    ContractBidController,
    ContractController,
    ProducerController,
    ProviderController,
    ProviderProductsController,
    ProviderServicesController,
<<<<<<< Updated upstream
    TradingservicesController,
=======
    TraderController,
>>>>>>> Stashed changes
    TraderInventoryController,
  ],
  providers: [
    AppService,
    CommodityService,
    ContractBidService,
    ContractService,
    ProducerService,
    ProviderService,
    ProviderProductsService,
    ProviderServicesService,
<<<<<<< Updated upstream
    TradingservicesService,
=======
    TraderService,
>>>>>>> Stashed changes
    TraderInventoryService,
    //   {
    //   provide: APP_GUARD,
    //   useClass: PostgresRestHandlerGuard,
    // },
  ],
})
export class AppModule {}
