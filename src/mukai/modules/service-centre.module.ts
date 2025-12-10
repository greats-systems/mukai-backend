import { Module } from '@nestjs/common';
import { PostgresRestHandlerModule } from 'src/common/postgresrest';
import { ServiceCentreController } from '../controllers/service-centre.controller';
import { ServiceCentreService } from '../services/service-centre.service';
import { SystemLogsModule } from './system-log.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [AuthModule, PostgresRestHandlerModule, SystemLogsModule],
  controllers: [ServiceCentreController],
  providers: [ServiceCentreService],
})
export class ServiceCentreModule {}
