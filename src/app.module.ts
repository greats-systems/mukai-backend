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

@Module({
  imports: [
    PostgresRestHandlerModule,
    AuthModule,
    ConfigModule.forRoot({ isGlobal: true }),
    UserModule,
    LedgerModule,
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
