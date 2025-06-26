import { Module } from '@nestjs/common';
import { SmartBizPostgresRest } from 'src/common/postgresrest/smart_biz_postgresrest';
import { PayslipsController } from '../controllers/payslip.controller';
import { PayslipsService } from '../services/payslip.service';

@Module({
  controllers: [PayslipsController],
  providers: [PayslipsService, SmartBizPostgresRest],
})
export class PayslipsModule {}
