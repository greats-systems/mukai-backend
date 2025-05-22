import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { PostgresRest } from 'src/common/postgresrest';
import { DemandOrderController } from './orders_demand.controller';
import { OrdersDemandService } from './orders-demand.service';
import { MessagingsService } from 'src/messagings/messagings.service';
import { UserService } from 'src/user/user.service';
import { NodesService } from 'src/nodes/nodes.service';
import { NodeMessagingService } from 'src/nodes/messaging.service';

@Module({
  controllers: [OrdersController, DemandOrderController],
  providers: [OrdersService, OrdersDemandService, UserService, PostgresRest, MessagingsService, NodesService, NodeMessagingService],
})
export class OrdersModule { }
