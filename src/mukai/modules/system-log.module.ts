import { Module } from '@nestjs/common';
import { PostgresRest } from 'src/common/postgresrest';
import { SystemLogsController } from '../controllers/system-logs.controller';
import { SystemLogsService } from '../services/system-logs.service';

@Module({
  providers: [SystemLogsService, PostgresRest],
  controllers: [SystemLogsController],
})
export class SystemLogsModule {}
