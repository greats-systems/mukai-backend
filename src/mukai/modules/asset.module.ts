import { Module } from '@nestjs/common';
import { AssetsController } from '../controllers/assets.controller';
import { AssetsService } from '../services/assets.service';
import { PostgresRest } from 'src/common/postgresrest';

@Module({
  controllers: [AssetsController],
  providers: [AssetsService, PostgresRest],
  exports: [PostgresRest],
})
export class AssetModule {}
