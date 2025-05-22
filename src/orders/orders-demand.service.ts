/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable, Logger } from '@nestjs/common';

import { PostgresRest } from 'src/common/postgresrest';
import { UpdateDemandOrderDto } from './dto/update-order.dto';
import { CreateDemandOrderDto } from './dto/create-order.dto';
import { MessagingsService } from 'src/messagings/messagings.service';
import { UserService } from 'src/user/user.service';
import { StringHelper } from 'src/helpers/string.helper';

@Injectable()
export class OrdersDemandService {
  private readonly logger = new Logger(PostgresRest.name);

  constructor(
    private readonly postgresRest: PostgresRest,
    private readonly messagingsService: MessagingsService,
    private readonly userService: UserService,
  ) {}
  async createOrderDemand(createOrderDto: CreateDemandOrderDto) {
    try {
      const order = createOrderDto;

      console.log('createOrderDto order', order);

      const inventory_item = createOrderDto.item;
      delete createOrderDto.item;
      console.log('createOrderDto', createOrderDto);
      const { error: reqError, data: resData } = await this.postgresRest
        .from('demands_requests')
        .insert(createOrderDto)
        .select()
        .single();

      if (resData) {
        order['id'] = resData.id;
        order['item'] = inventory_item;
        inventory_item!['order_id'] = resData.id;

        await this.postgresRest
          .from('demand_request_items')
          .insert(inventory_item);
        //broadcast to profiles by order category and location

        console.log('createOrderDto order', order);
        await this.broadcastDemand(order);
        const { data: orderData } = await this.postgresRest
          .from('demands_requests')
          .select('*, demand_request_items(*)')
          .eq('id', resData.id)
          .single();
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

  findOne(id: string) {
    return `This action updates a #${id} order`;
  }

  async update(id: string, updateOrderDto: UpdateDemandOrderDto) {
    try {
      console.log('updateOrderDto order id', id);
      console.log('updateOrderDto order', updateOrderDto);

      const order = updateOrderDto;
      const offer_item = updateOrderDto.offer;

      const { error: updateError, data: orderData } = await this.postgresRest
        .from('demands_requests')
        .update({ status: updateOrderDto.status })
        .eq('id', id)
        .select(
          '*,demands_requests_customer_id_fkey(*), demand_request_items(*)',
        )
        .single();

      if (orderData) {
        console.log(
          'updateOrderDto order',
          orderData['demand_request_items'][0]['name'],
        );
        const item_name = orderData['demand_request_items'][0]['name'];
        order['customer_id'] = orderData['customer_id'];
        order['item'] = orderData['demand_request_items'][0];
        order['accepted_by'] = orderData['accepted_by'] ?? [];
        order['rejected_by'] = orderData['rejected_by'] ?? [];
        order['chained_providers'] = orderData['chained_providers'] ?? [];
        order['notified_providers'] = orderData['notified_providers'] ?? [];
        order['offer'] = offer_item;
        console.log('updateOrderDto offer_item', offer_item);

        if (order.status == 'accepted') {
          order['accepted_by'].push(updateOrderDto.provider_id);
          await this.postgresRest
            .from('demands_requests')
            .update({ accepted_by: order['accepted_by'] })
            .eq('id', id)
            .select(
              '*,demands_requests_customer_id_fkey(*), demand_request_items(*)',
            )
            .single();

          const { error: insertError } = await this.postgresRest
            .from('demand_request_engagements')
            .insert({
              provider_price_offer: offer_item?.provider_price_offer,
              message: offer_item?.message,
              order_id: offer_item?.order_id,
              category: offer_item?.category,
            })
            .select()
            .single();
          if (insertError) {
            console.log('demand_request_engagements insert error', insertError);
          }
          const message = `A potentail supplier has responded to your ${item_name || 'New'} demand request`;
          console.log('updateOrderDto order', order);

          await this.notifyCustomerDemand(orderData, message);
        } else if (order.status == 'rejected') {
          order['rejected_by'].push(updateOrderDto.provider_id);
          await this.postgresRest
            .from('demands_requests')
            .update({ rejected_by: order['rejected_by'] })
            .eq('id', id)
            .select(
              '*,demands_requests_customer_id_fkey(*), demand_request_items(*)',
            )
            .single();

          const { error: insertError } = await this.postgresRest
            .from('demand_request_engagements')
            .insert({
              provider_price_offer: offer_item?.provider_price_offer,
              message: offer_item?.message,
              order_id: offer_item?.order_id,
              category: offer_item?.category,
            })
            .select()
            .single();
          if (insertError) {
            console.log('demand_request_engagements insert error', insertError);
          }
        } else if (order.status == 'negotiated') {
          await this.postgresRest
            .from('demand_request_engagements')
            .insert(offer_item);
          const message = `Your request for ${item_name} was negotiated  @ $${order.offer?.provider_price_offer}`;
          await this.notifyCustomerDemand(orderData, message);
        } else if (order.status == 'cancelled_by_customer') {
          order['notified_providers'] = orderData['notified_providers'];

          console.log('order cancelled_by_customer');
          console.log(
            'updateOrderDto cancelled_by_customer orderData',
            orderData,
          );
          const message = `Demand Order Request for ${item_name} was cancelled by customer`;
          await this.broadcastDemandCancellation(orderData, message);
        }

        const { data: updatedOrderData } = await this.postgresRest
          .from('demands_requests')
          .select('*, demand_request_items(*)')
          .eq('id', id)
          .single();
        return {
          status: 'success',
          message: 'order created successfully',
          data: updatedOrderData,
          error: null,
        };
      } else {
        console.log('updateOrderDto reqError', updateError);
        return {
          status: 'failed',
          message: updateError,
          data: null,
          error: updateError,
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

  remove(id: string) {
    return `This action removes a #${id} order`;
  }
  // Notifiers
  async notifyCustomerDemand(order: UpdateDemandOrderDto, message: string) {
    try {
      // get the profiles to broadcast to by order category and location
      const { error: profilesError, data: profiles } = await this.postgresRest
        .from('profiles')
        .select('push_token')
        .eq('id', order.customer_id)
        .single(); // Filter out profiles without push tokens

      if (profilesError) {
        this.logger.error(
          'Failed to fetch profiles for notification',
          profilesError,
        );
        return; // or handle error appropriately
      }

      if (!profiles) {
        this.logger.log(
          'No profiles with push tokens found for this specialization',
        );
        return;
      }

      try {
        const customerProfile = await this.userService.getUser(
          order.customer_id,
        );
        // Send notifications
        console.log('customerProfile?.customer_id!', customerProfile?.id!);
        console.log(
          'customerProfile?.push_token!',
          customerProfile?.push_token!,
        );
        await this.messagingsService.sendNotification({
          token: customerProfile?.push_token!,
          title: `${StringHelper.getOrderTitle(order) || 'New'} Demand Response`,
          body: JSON.stringify({
            category: 'order-request',
            data: {
              order_id: order?.id,
            },
            message: message,
          }),
        });
        this.logger.log(
          `Notification sent successfully for new demand from customer ${customerProfile?.first_name}`,
        );
      } catch (error) {
        this.logger.error('Error in notification process', error);
        // Consider adding retry logic or alternative handling here
      }
    } catch (error) {
      this.logger.error('Failed to send notifications', error);
      // Handle error or retry logic if needed
    }
  }

  async broadcastDemand(createOrderDto: CreateDemandOrderDto) {
    try {
      // get the profiles to broadcast to by order category and location
      const { error: profilesError, data: profiles } = await this.postgresRest
        .from('profiles')
        .select('id, push_token')
        .eq('specialization', createOrderDto.category)
        .not('push_token', 'is', null); // Filter out profiles without push tokens

      if (profilesError) {
        this.logger.error(
          'Failed to fetch profiles for notification',
          profilesError,
        );
        return; // or handle error appropriately
      }

      if (!profiles?.length) {
        this.logger.log(
          'No profiles with push tokens found for this specialization',
        );
        return;
      }
      const customerProfile = await this.userService.getUser(
        createOrderDto.customer_id,
      );
      console.log('createOrderDto.item', createOrderDto.item);
      // Extract push tokens from profiles
      const notified_providers = profiles
        .map((profile) => profile.id)
        .filter((id) => !!id && id !== customerProfile?.id);
      const validTokens = profiles
        .map((profile) => profile.push_token)
        .filter((token) => !!token && token !== customerProfile?.push_token);
      if (!validTokens.length) {
        this.logger.log('No valid push tokens found for notification');
        return;
      }

      try {
        // Send notifications
        await this.messagingsService.sendNotificationToMultipleTokens({
          tokens: validTokens,
          title: `${createOrderDto.item?.name.toUpperCase() || 'NEW'} DEMAND BROADCAST`,
          body: JSON.stringify({
            category: 'order-request',
            data: {
              order_id: createOrderDto?.id,
            },
            message: `Customer ${customerProfile?.last_name || ''} in ${customerProfile?.city || customerProfile?.country || 'your area'} has is  requesting ${createOrderDto.item?.quantity} of ${createOrderDto.item?.name || 'a new'} @ $${createOrderDto.item?.price}`,
          }),
        });

        await this.postgresRest
          .from('demands_requests')
          .update({ notified_providers: notified_providers })
          .eq('id', createOrderDto.id);

        this.logger.log(
          `Notification sent successfully for new demand from customer ${customerProfile?.first_name}`,
        );
      } catch (error) {
        this.logger.error('Error in notification process', error);
        // Consider adding retry logic or alternative handling here
      }
      this.logger.log(
        `Notification sent successfully to ${validTokens.length} devices`,
      );
    } catch (error) {
      this.logger.error('Failed to send notifications', error);
      // Handle error or retry logic if needed
    }
  }
  async broadcastDemandCancellation(
    order: UpdateDemandOrderDto,
    message: string,
  ) {
    try {
      // get the profiles to broadcast to by order category and location
      const { error: profilesError, data: profiles } = await this.postgresRest
        .from('profiles')
        .select('id, push_token')
        .in('id', order['notified_providers'])
        .not('push_token', 'is', null); // Filter out profiles without push tokens

      if (profilesError) {
        this.logger.error(
          'Failed to fetch profiles for notification',
          profilesError,
        );
        return; // or handle error appropriately
      }

      if (!profiles?.length) {
        this.logger.log(
          'No profiles with push tokens found for this specialization',
        );
        return;
      }
      const customerProfile = await this.userService.getUser(order.customer_id);
      const validTokens = profiles
        .map((profile) => profile.push_token)
        .filter((token) => !!token && token !== customerProfile?.push_token);
      if (!validTokens.length) {
        this.logger.log('No valid push tokens found for notification');
        return;
      }

      try {
        await this.messagingsService.sendNotificationToMultipleTokens({
          tokens: validTokens,
          title: `BROADCASTED ${order.item?.name.toUpperCase() || 'NEW'} ORDER CANCELLED`,
          body: JSON.stringify({
            category: 'order-request',
            data: {
              order_id: order?.id,
            },
            message: message,
          }),
        });
        this.logger.log(
          `Notification sent successfully for new demand from customer ${customerProfile?.first_name}`,
        );
      } catch (error) {
        this.logger.error('Error in notification process', error);
        // Consider adding retry logic or alternative handling here
      }
      this.logger.log(
        `Notification sent successfully to ${validTokens.length} devices`,
      );
    } catch (error) {
      this.logger.error('Failed to send notifications', error);
      // Handle error or retry logic if needed
    }
  }
}
