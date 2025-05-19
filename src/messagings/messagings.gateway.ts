import { MessagingsService } from './messagings.service';
import { MultipleDeviceNotificationDto, NotificationDto, TopicNotificationDto } from './dto/create-messaging.dto';

import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
@WebSocketGateway({
  cors: {
    origin: '*',
  },
}) export class MessagingsGateway {
  @WebSocketServer()
  server: Server;
  constructor(private readonly messagingsService: MessagingsService) { }

  @SubscribeMessage('createMessaging')
  create(@MessageBody() notificationDto: NotificationDto) {
    return this.messagingsService.sendNotification(notificationDto);
  }

  @SubscribeMessage('broadcast')
  findOne(@MessageBody() multipleDeviceNotificationDto: MultipleDeviceNotificationDto) {
    return this.messagingsService.sendNotificationToMultipleTokens(multipleDeviceNotificationDto);
  }

  @SubscribeMessage('updateMessaging')
  update(@MessageBody() topicNotificationDto: TopicNotificationDto) {
    return this.messagingsService.sendTopicNotification(topicNotificationDto);
  }

}

