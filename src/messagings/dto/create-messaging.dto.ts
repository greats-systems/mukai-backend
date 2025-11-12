import { ApiProperty, ApiPropertyOptional, PickType } from '@nestjs/swagger';
export class CreateMessagingDto {}

export class NotificationDto {
  @ApiProperty({
    type: String,
    description: 'Client device token',
  })
  token: string;

  @ApiProperty({
    type: String,
    description: 'Notification Title',
  })
  title: string;

  @ApiProperty({
    type: String,
    description: 'Notification Body',
  })
  body: string;
}

export class MultipleDeviceNotificationDto extends PickType(NotificationDto, [
  'title',
  'body',
]) {
  @ApiProperty({
    type: String,
    description: 'Clients device token',
  })
  tokens: string[];
}

export class TopicNotificationDto extends PickType(NotificationDto, [
  'title',
  'body',
]) {
  @ApiProperty({
    type: String,
    description: 'Subscription topic to send to',
  })
  topic: string;
}
