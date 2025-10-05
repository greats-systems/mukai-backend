import { Controller, Post, Body } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiExcludeController,
} from '@nestjs/swagger';
import {
  MultipleDeviceNotificationDto,
  TopicNotificationDto,
} from './dto/create-messaging.dto';
import { MessagingsService } from './messagings.service';

@ApiTags('notifications')
@ApiExcludeController()
@Controller('messages')
export class MessagingController {
  constructor(private readonly messagingsService: MessagingsService) {}

  @Post('send-notification')
  @ApiOperation({ summary: 'Send a push notification to a single device' })
  @ApiResponse({ status: 200, description: 'Notification sent successfully' })
  async sendNotification(
    @Body() body: { token: string; title: string; body: string; icon: string },
  ) {
    return this.messagingsService.sendNotification({
      token: body.token,
      title: body.title,
      body: body.body,
    });
  }

  @Post('send-multiple-notifications')
  @ApiOperation({ summary: 'Send push notifications to multiple devices' })
  @ApiResponse({ status: 200, description: 'Notifications sent successfully' })
  async sendMultipleNotifications(@Body() body: MultipleDeviceNotificationDto) {
    return this.messagingsService.sendNotificationToMultipleTokens({
      tokens: body.tokens,
      title: body.title,
      body: body.body,
    });
  }

  @Post('send-topic-notification')
  @ApiOperation({ summary: 'Send a push notification to a topic' })
  @ApiResponse({
    status: 200,
    description: 'Topic notification sent successfully',
  })
  async sendTopicNotification(@Body() body: TopicNotificationDto) {
    return this.messagingsService.sendTopicNotification({
      topic: body.topic,
      title: body.title,
      body: body.body,
    });
  }
}
