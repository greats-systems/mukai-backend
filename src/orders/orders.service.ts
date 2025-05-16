import { Injectable } from '@nestjs/common';

import { PostgresRest } from 'src/common/postgresrest';
import { UpdateOrderDto } from './dto/update-order.dto';
import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class OrdersService {
  constructor(
    private readonly postgresRest: PostgresRest,
  ) { }
  async create(createOrderDto: CreateOrderDto) {

    try {

      const { error: profileError } = await this.postgresRest
        .from('orders')
        .insert({});

      if (profileError) {
        // Rollback auth user creation if profile fails
        throw new Error(`Profile creation failed: ${profileError.message}`);
      }

    } catch (error) {

    }
    return 'This action adds a new order';
  }

  findAll() {
    return `This action returns all orders`;
  }

  findOne(id: string) {
    return `This action returns a #${id} order`;
  }

  update(id: string, updateOrderDto: UpdateOrderDto) {
    return `This action updates a #${id} order`;
  }

  remove(id: string) {
    return `This action removes a #${id} order`;
  }
}
