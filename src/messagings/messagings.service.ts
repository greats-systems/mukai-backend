import { Injectable } from '@nestjs/common';
import {
  MultipleDeviceNotificationDto,
  NotificationDto,
  TopicNotificationDto,
} from './dto/create-messaging.dto';

import * as admin from 'firebase-admin';

@Injectable()
export class MessagingsService {
  constructor() {}

  async sendNotification({ token, title, body }: NotificationDto) {
    try {
      const response = await admin.messaging().send({
        token,
        notification: {
          title,
          body,
        },
      });
      return response;
    } catch (error) {
      console.log('Successfully sent error:', error);

      throw error;
    }
  }

  async sendNotificationToMultipleTokens({
    tokens,
    title,
    body,
  }: MultipleDeviceNotificationDto) {
    const message = {
      notification: {
        title,
        body,
      },
      tokens,
    };

    try {
      const response = await admin.messaging().sendEachForMulticast(message);
      console.log('Successfully sent messages:', response.responses);
      return {
        success: true,
        message: `Successfully sent ${response.successCount} messages; ${response.failureCount} failed.`,
      };
    } catch (error) {
      console.log('Error sending messages:', error);
      return { success: false, message: 'Failed to send notifications' };
    }
  }

  async sendTopicNotification({ topic, title, body }: TopicNotificationDto) {
    const message = {
      notification: {
        title,
        body,
      },
      topic,
    };

    try {
      const response = await admin.messaging().send(message);
      console.log('Successfully sent message:', response);
      return { success: true, message: 'Topic notification sent successfully' };
    } catch (error) {
      console.log('Error sending message:', error);
      return { success: false, message: 'Failed to send topic notification' };
    }
  }
}
