/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiExcludeController } from '@nestjs/swagger';
import { NotifyTextService } from './notify_text.service';

@ApiTags('text')
@ApiExcludeController()
@Controller('text')
export class NotifyTextController {
  constructor(private readonly ntService: NotifyTextService) {}

  @Post('send-sms')
  //   @ApiOperation({ summary: 'Send a push notification to a single device' })
  //   @ApiResponse({ status: 200, description: 'Notification sent successfully' })
  async sendSms(
    @Body()
    body: {
      sender: string;
      scheduled_time: string;
      smslist: [
        {
          message: string;
          mobiles: string;
          client_ref: string;
        },
      ];
    },
  ): Promise<any> {
    const response = await this.ntService.sendSms(body);
    return response;
  }
  @Post('balance-enquiry')
  //   @ApiOperation({ summary: 'Send a push notification to a single device' })
  //   @ApiResponse({ status: 200, description: 'Notification sent successfully' })
  async checkBalance(): Promise<any> {
    const response = await this.ntService.checkBalance();
    return response;
  }
  /*
  @Post('send-multiple-notifications')
  @ApiOperation({ summary: 'Send push notifications to multiple devices' })
  @ApiResponse({ status: 200, description: 'Notifications sent successfully' })
  async sendMultipleNotifications(@Body() body: MultipleDeviceNotificationDto) {
    return this.ntService.sendNotificationToMultipleTokens({
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
    return this.ntService.sendTopicNotification({
      topic: body.topic,
      title: body.title,
      body: body.body,
    });
  }
  */
}
