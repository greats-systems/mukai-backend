import { Module } from '@nestjs/common';
import { MukaiUserController } from './mukai-user.controller';
import { MukaiUserService } from './mukai-user.service';

@Module({
  controllers: [MukaiUserController],
  providers: [MukaiUserService],
})
export class MukaiUserModule {}
