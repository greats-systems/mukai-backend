import { Module } from '@nestjs/common';
import { ProviderServicesService } from '../services/provider-services.service';
import { ProviderServicesController } from '../controllers/provider-services.controller';
import { PostgresRest } from 'src/common/postgresrest';

@Module({
  controllers: [ProviderServicesController],
  providers: [ProviderServicesService, PostgresRest],
})
export class ProviderServicesModule {}
