import { Injectable } from '@nestjs/common';
import { NodeMessagingService } from './messaging.service';
import { NotificationDto } from 'src/messagings/dto/create-messaging.dto';

@Injectable()
export class NodesService {
    constructor(private readonly messagingNodeService: NodeMessagingService) {}

  async broadcastMessageToParties(notificationDto: NotificationDto) {
    await this.messagingNodeService.sendNotificationToMultipleTokens(notificationDto)
    return 'This action adds a new node';
  }

}
