import { Module } from '@nestjs/common';
import { NodesService } from './nodes.service';
import { NodeMessagingService } from './messaging.service';
import { CoreProduceNetworkWsService } from './network-ws.service';
import { ProduceChainCodeService } from './produce_chaincode_api.service';
import { ConfigService } from '@nestjs/config';

@Module({
  controllers: [],
  providers: [NodesService, NodeMessagingService, CoreProduceNetworkWsService, ConfigService, ProduceChainCodeService],
  exports: [CoreProduceNetworkWsService],

})
export class NodesModule { }
