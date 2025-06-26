import { Module } from '@nestjs/common';
import { EmployeesController } from '../controllers/employee.controller';
import { EmployeesService } from '../services/employee.service';
import { SmartBizPostgresRest } from 'src/common/postgresrest/smart_biz_postgresrest';
// import { SmartBizPostgresRest } from 'src/common/postgresrest/smart_biz_postgresrest';

@Module({
  controllers: [EmployeesController],
  providers: [EmployeesService, SmartBizPostgresRest],
})
export class EmployeesModule {}
