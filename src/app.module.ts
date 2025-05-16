import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';


import {
  // PostgresRestHandlerGuard,
  PostgresRestHandlerModule
} from './common/postgresrest';
// import { APP_GUARD } from '@nestjs/core';
import { OrdersModule } from './orders/orders.module';
import { NotificationsService } from './notifications/notifications.service';
import { MessagingsModule } from './messagings/messagings.module';
import { FirebaseModule } from './common/firebase/firebase.module';
import { InventoriesModule } from './inventories/inventories.module';
import { OrganizationsModule } from './organizations/organizations.module';

@Module({
  imports: [
    PostgresRestHandlerModule,
    AuthModule, ConfigModule.forRoot({ isGlobal: true, cache: true }), UserModule, OrdersModule, MessagingsModule, FirebaseModule, InventoriesModule, OrganizationsModule],
  controllers: [AppController],
  providers: [AppService, NotificationsService,
    //   {
    //   provide: APP_GUARD,
    //   useClass: PostgresRestHandlerGuard,
    // },
  ],
})
export class AppModule { }
