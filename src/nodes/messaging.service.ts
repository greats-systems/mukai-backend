/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable } from '@nestjs/common';
import FireFly from '@hyperledger/firefly-sdk';

import {
  NotificationDto,
  TopicNotificationDto,
} from 'src/messagings/dto/create-messaging.dto';

@Injectable()
export class NodeMessagingService {
  private fNetwork = new FireFly({ host: 'http://localhost:5000' });

  constructor() {}

  async sendNotificationToMultipleTokens({ body }: NotificationDto) {
    // const message = {
    //   notification: {
    //     title,
    //     body,
    //   },
    //   tokens,
    // };
    try {
      console.log('this.fNetwork.sendBroadcast');

      const message = await this.fNetwork.sendBroadcast({
        header: {
          tag: 'yesday',
          topics: ['goodday'],
        },
        data: [{ value: 'This is a message' }],
      });
      return { type: 'message', id: message.header.id };
    } catch (error) {
      console.log('Error sending messages:', error);
      return { success: false, message: 'Failed to send notifications' };
    }
  }

  async sendPrivateMessage({ topic, title, body }: TopicNotificationDto) {
    const message = {
      notification: {
        title,
        body,
      },
      topic,
    };

    try {
      const message = await this.fNetwork.sendPrivateMessage({
        header: {
          tag: 'greats',
          topics: ['message'],
        },
        group: {
          members: [{ identity: 'did:firefly:org/zb-investments' }],
        },
        data: [{ value: 'This is a message' }],
      });
      return { type: 'message', id: message.header.id };
    } catch (error) {
      console.log('Error sending message:', error);
      return { success: false, message: 'Failed to send topic notification' };
    }
  }
}
