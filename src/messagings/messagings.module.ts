import { Module } from '@nestjs/common';
import { MessagingsService } from './messagings.service';
import { MessagingsGateway } from './messagings.gateway';
import { FirebaseModule } from 'src/common/firebase/firebase.module';
import { MessagingController } from './messaging.controller';

@Module({
  imports: [FirebaseModule],
  controllers: [MessagingController],
  providers: [MessagingsGateway, MessagingsService],
})
export class MessagingsModule { }
