import { PostgresRest } from 'src/common/postgresrest';
import { GroupsController } from '../controllers/group.controller';
import { GroupService } from '../services/group.service';
import { Module } from '@nestjs/common';

@Module({
  controllers: [GroupsController],
  providers: [GroupService, PostgresRest],
})
export class GroupModule {}
