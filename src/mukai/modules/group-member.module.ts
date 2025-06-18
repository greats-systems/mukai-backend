import { PostgresRest } from 'src/common/postgresrest';
import { Module } from '@nestjs/common';

@Module({
  controllers: [GroupMembersController],
  providers: [GroupMembersService, PostgresRest],
})
export class GroupMembersModule {}
