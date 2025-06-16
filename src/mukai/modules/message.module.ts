import { Module } from '@nestjs/common';
import { MessagesController } from '../controllers/messages.controller';
import { MessagesService } from '../services/messages.service';
import { PostgresRest } from 'src/common/postgresrest';

@Module({
  controllers: [MessagesController],
  providers: [MessagesService, PostgresRest],
})
export class MessageModule {}
