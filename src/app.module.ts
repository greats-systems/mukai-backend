import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import * as LedgerController from './ledger/ledger.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { LedgerModule } from './ledger/ledger.module';

import {
  // PostgresRestHandlerGuard,
  PostgresRestHandlerModule,
} from './common/postgresrest';
// import { APP_GUARD } from '@nestjs/core';
import { OrdersModule } from './orders/orders.module';
import { NotificationsService } from './notifications/notifications.service';
import { MessagingsModule } from './messagings/messagings.module';
import { FirebaseModule } from './common/firebase/firebase.module';
import { InventoriesModule } from './inventories/inventories.module';
import { OrganizationsModule } from './organizations/organizations.module';
import { NodesModule } from './nodes/nodes.module';
import { TradingservicesModule } from './tradingservices/tradingservices.module';

@Module({
  imports: [
    PostgresRestHandlerModule,
    AuthModule,
    ConfigModule.forRoot({ isGlobal: true }),
    UserModule,
    LedgerModule,OrdersModule, MessagingsModule, InventoriesModule, NodesModule, TradingservicesModule
  ],
  controllers: [
    AppController,
    LedgerController.CommodityController,
    LedgerController.ContractBidController,
    LedgerController.ContractController,
    LedgerController.ProducerController,
    LedgerController.ProviderController,
    LedgerController.ProviderProductsController,
    LedgerController.ProviderServicesController,
    LedgerController.TraderController,
    LedgerController.TraderInventoryController,
  ],
  providers: [
    AppService,
    //   {
    //   provide: APP_GUARD,
    //   useClass: PostgresRestHandlerGuard,
    // },
  ],
})
export class AppModule {}
