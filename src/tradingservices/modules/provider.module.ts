import { Module } from '@nestjs/common';
import { ProviderService } from '../services/provider.service';
import { ProviderController } from '../controllers/provider.controller';
import { PostgresRest } from 'src/common/postgresrest';

@Module({
  controllers: [ProviderController],
  providers: [ProviderService, PostgresRest],
})
export class ProviderModule {}
