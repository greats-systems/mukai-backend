import { Module } from '@nestjs/common';
import { ChatsController } from '../controllers/chats.controller';
import { ChatsService } from '../services/chats.service';
import { PostgresRest } from 'src/common/postgresrest';

@Module({
  controllers: [ChatsController],
  providers: [ChatsService, PostgresRest],
})
export class ChatModule {}
