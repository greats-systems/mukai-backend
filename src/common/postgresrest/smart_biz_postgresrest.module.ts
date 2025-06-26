import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { PostgresRestHandlerStrategy } from './postgresrest.strategy';
import { PostgresRestHandlerGuard } from './postgresrest.guard';
import { SmartBizPostgresRest } from './smart_biz_postgresrest';

@Module({
  imports: [ConfigModule],
  providers: [
    SmartBizPostgresRest,
    PostgresRestHandlerStrategy,
    PostgresRestHandlerGuard,
  ],
  exports: [
    SmartBizPostgresRest,
    PostgresRestHandlerStrategy,
    PostgresRestHandlerGuard,
  ],
})
export class SmartBizPostgresRestHandlerModule {}
