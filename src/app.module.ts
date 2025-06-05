import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';

import { PostgresRestHandlerModule } from './common/postgresrest';
import { OrdersModule } from './orders/orders.module';
import { MessagingsModule } from './messagings/messagings.module';
import { NodesModule } from './nodes/nodes.module';
import { CommodityController } from './tradingservices/controllers/commodity.controller';
import { ContractBidController } from './tradingservices/controllers/contract-bid.controller';
import { ContractController } from './tradingservices/controllers/contract.controller';
import { ProducerController } from './tradingservices/controllers/producer.controller';
import { ProviderController } from './tradingservices/controllers/provider.controller';
import { ProviderProductsController } from './tradingservices/controllers/provider-products.controller';
import { ProviderServicesController } from './tradingservices/controllers/provider-services.controller';
import { TradingservicesController } from './tradingservices/controllers/tradingservices.controller';
import { TraderInventoryController } from './tradingservices/controllers/trader-inventory.controller';
import { TradingservicesModule } from './tradingservices/modules/tradingservices.module';
import { CommodityModule } from './tradingservices/modules/commodity.module';
import { ContractBidModule } from './tradingservices/modules/contract-bid.module';
import { ContractModule } from './tradingservices/modules/contract.module';
import { ProducerModule } from './tradingservices/modules/producer.module';
import { ProviderModule } from './tradingservices/modules/provider.module';
import { ProviderProductsModule } from './tradingservices/modules/provider-products.module';
import { ProviderServicesModule } from './tradingservices/modules/provider-services.module';
import { TraderInventoryService } from './tradingservices/services/trader-inventory.service';
import { CommodityService } from './tradingservices/services/commodity.service';
import { ContractBidService } from './tradingservices/services/contract-bidding.service';
import { ContractService } from './tradingservices/services/contracts.service';
import { ProducerService } from './tradingservices/services/producers.service';
import { ProviderProductsService } from './tradingservices/services/provider-products.service';
import { ProviderService } from './tradingservices/services/provider.service';
import { ProviderServicesService } from './tradingservices/services/provider-services.service';
import { TradingservicesService } from './tradingservices/services/tradingservices.service';
import { ProduceModule } from './tradingservices/modules/produce.module';

@Module({
  imports: [
    PostgresRestHandlerModule,
    AuthModule,
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    UserModule,
    OrdersModule,
    MessagingsModule,
    NodesModule,
    CommodityModule,
    ProduceModule,
    ContractBidModule,
    ContractModule,
    ProducerModule,
    ProviderModule,
    ProviderProductsModule,
    ProviderServicesModule,
    TradingservicesModule,
    
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
    TradingservicesController,
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
    TradingservicesService,
    TraderInventoryService,
    //   {
    //   provide: APP_GUARD,
    //   useClass: PostgresRestHandlerGuard,
    // },
  ],
})
export class AppModule {}
