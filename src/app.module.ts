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

@Module({
  imports: [    
    PostgresRestHandlerModule,
    AuthModule, ConfigModule.forRoot({ isGlobal: true }), UserModule],
  controllers: [AppController],
  providers: [AppService,
    //   {
    //   provide: APP_GUARD,
    //   useClass: PostgresRestHandlerGuard,
    // },
  ],
})
export class AppModule { }
