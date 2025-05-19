import { Injectable, Logger } from '@nestjs/common';

import { PostgresRest } from 'src/common/postgresrest';
import { UpdateOrderDto } from './dto/update-order.dto';
import { CreateDemandOrderDto, CreateOrderDto } from './dto/create-order.dto';
import { CreateDemandRequestInventoryDto } from 'src/inventories/dto/create-inventory.dto';
import { MessagingsService } from 'src/messagings/messagings.service';
import { UserService } from 'src/user/user.service';

@Injectable()
export class OrdersDemandService {
  private readonly logger = new Logger(PostgresRest.name);

  constructor(
    private readonly postgresRest: PostgresRest,
    private readonly messagingsService: MessagingsService,
    private readonly userService: UserService,
  ) { }
  async createOrderDemand(createOrderDto: CreateDemandOrderDto) {
    try {
      var inventory_item = createOrderDto.item
      delete createOrderDto.item

      console.log('createOrderDto', createOrderDto);
      const { error: reqError, data: resData } = await this.postgresRest
        .from('demands_requests')
        .insert(createOrderDto)
        .select()
        .single()


      if (resData) {
        inventory_item!['order_id'] = resData.id
        await this.postgresRest
          .from('demand_request_items')
          .insert(inventory_item);
        //broadcast to profiles by order category and location
        await this.broadcastDemand(createOrderDto)
        const { data: orderData } = await this.postgresRest
          .from('demands_requests')
          .select('*, demand_request_items(*)').eq('id', resData.id).single();
        return {
          status: 'success',
          message: 'order created successfully',
          data: orderData,
          error: null,
        };
      } else if (reqError) {
        console.log('createOrderDto reqError', reqError);
        return {
          status: 'failed',
          message: reqError,
          data: null,
          error: reqError,
        };
      }

    } catch (error) {
      console.log('createOrderDto error', error);

      return {
        status: 'failed',
        message: error,
        data: null,
        error: error,
      };

    }
  }

  findAll() {
    return `This action returns all orders`;
  }

  async broadcastDemand(createOrderDto: CreateDemandOrderDto) {
    try {
      // get the profiles to broadcast to by order category and location
      const { error: profilesError, data: profiles } = await this.postgresRest
        .from('profiles')
        .select('push_token')
        .eq('specialization', createOrderDto.category)
        .not('push_token', 'is', null); // Filter out profiles without push tokens

      if (profilesError) {
        this.logger.error('Failed to fetch profiles for notification', profilesError);
        return; // or handle error appropriately
      }

      if (!profiles?.length) {
        this.logger.log('No profiles with push tokens found for this specialization');
        return;
      }

      // Extract push tokens from profiles
      const validTokens = profiles
        .map(profile => profile.push_token)
        .filter(token => !!token); // Additional safety filter

      if (!validTokens.length) {
        this.logger.log('No valid push tokens found for notification');
        return;
      }

      try {
        var customerProfile = await this.userService.getUser(createOrderDto.customer_id)

        // Send notifications
        await this.messagingsService.sendNotificationToMultipleTokens({
          tokens: validTokens,
          title: `${createOrderDto.item?.name || 'New'} Demand`,
          body: `Customer ${customerProfile?.first_name || ''} in ${customerProfile?.city || customerProfile?.country || 'your area'} has published ${createOrderDto.item?.name || 'a new'} Demand`,
        });

        this.logger.log(`Notification sent successfully for new demand from customer ${customerProfile?.first_name}`);
      } catch (error) {
        this.logger.error('Error in notification process', error);
        // Consider adding retry logic or alternative handling here
      }
      this.logger.log(`Notification sent successfully to ${validTokens.length} devices`);
    } catch (error) {
      this.logger.error('Failed to send notifications', error);
      // Handle error or retry logic if needed
    }
  }

  findOne(id: string) {
    return `This action updates a #${id} order`;
  }
  update(id: string, updateOrderDto: UpdateOrderDto) {
    return `This action updates a #${id} order`;
  }
  remove(id: string) {
    return `This action removes a #${id} order`;
  }
}
