import { Module } from '@nestjs/common';
import { ProviderProductsService } from '../services/provider-products.service';
import { ProviderProductsController } from '../controllers/provider-products.controller';
import { PostgresRest } from 'src/common/postgresrest';

@Module({
  controllers: [ProviderProductsController],
  providers: [ProviderProductsService, PostgresRest],
})
export class ProviderProductsModule {}
