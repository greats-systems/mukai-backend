import { Module } from '@nestjs/common';
import { OrganizationsController } from '../controllers/organizations.controller';
import { OrganizationsService } from '../services/organizations.service';
import { PostgresRest } from 'src/common/postgresrest';

@Module({
  controllers: [OrganizationsController],
  providers: [OrganizationsService, PostgresRest],
})
export class OrganizationModule {}
