import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { PostgresRest } from 'src/common/postgresrest';
import { DemandOrderController } from './orders_demand.controller';
import { OrdersDemandService } from './orders-demand.service';
import { MessagingsService } from 'src/messagings/messagings.service';
import { UserService } from 'src/user/user.service';

@Module({
  controllers: [OrdersController, DemandOrderController],
  providers: [OrdersService, OrdersDemandService, UserService, PostgresRest, MessagingsService],
})
export class OrdersModule { }
