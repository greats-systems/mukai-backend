import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { PostgresRestHandlerStrategy } from './postgresrest.strategy';
import { PostgresRestHandlerGuard } from './postgresrest.guard';
import { PostgresRest } from './postgresrest';

@Module({
  imports: [ConfigModule],
  providers: [
    PostgresRest,
    PostgresRestHandlerStrategy,
    PostgresRestHandlerGuard,
  ],
  exports: [
    PostgresRest,
    PostgresRestHandlerStrategy,
    PostgresRestHandlerGuard,
  ],
})
export class PostgresRestHandlerModule {}
