import { Module } from '@nestjs/common';
import { NodesService } from './nodes.service';
import { NodeMessagingService } from './messaging.service';

@Module({
  controllers: [],
  providers: [NodesService,NodeMessagingService],
})
export class NodesModule {}
