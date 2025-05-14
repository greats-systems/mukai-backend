import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PostgresRest } from 'src/common/postgresrest';
import { ProfileSeeder } from './profile_seeder.service';

@Module({
  controllers: [UserController],
  providers: [UserService, ProfileSeeder, PostgresRest],
  exports: [UserService, ProfileSeeder]

})
export class UserModule {}
