import { Module } from '@nestjs/common';
import { NotifyTextController } from './notify-text.controller';
import { NotifyTextService } from './notify_text.service';

@Module({
  controllers: [NotifyTextController],
  providers: [NotifyTextService],
})
export class NotifyTextModule {}
