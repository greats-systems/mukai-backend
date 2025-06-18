import { PostgresRest } from 'src/common/postgresrest';
import { Module } from '@nestjs/common';

@Module({
  controllers: [],
  providers: [ PostgresRest],
})
export class GroupMembersModule {}
