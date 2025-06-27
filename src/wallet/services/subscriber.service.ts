/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-function-type */
import { Logger, Injectable } from '@nestjs/common';
import { ErrorResponseDto } from 'src/common/dto/error-response.dto';
import { PostgresRest } from 'src/common/postgresrest';
import { CreateSubscriberDto } from '../dto/create/create-subscriber.dto';
import { UpdateSubscriberDto } from '../dto/update/update-subscriber.dto';
import { Subscriber } from '../entities/subscriber.entity';
import { CreateSubscriberRequest, SmileWalletService } from './zb_digital_wallet.service';

function initLogger(funcname: Function): Logger {
  return new Logger(funcname.name);
}

@Injectable()
export class SubscriberService {
  private readonly logger = initLogger(SubscriberService);
  // inject wallet service
  constructor(private readonly postgresrest: PostgresRest, private readonly smileWalletService: SmileWalletService) { }

  async createSubscriber(
    createSubscriberDto: CreateSubscriberDto,
  ): Promise<Subscriber | ErrorResponseDto> {
    try {
      const { data, error } = await this.postgresrest
        .from('zb_wallet_subscribers')
        .insert(createSubscriberDto)
        .select()
        .single();

      if (error) {
        console.log(error);
        return new ErrorResponseDto(400, error.message);
      }
      if (!data) {
        return new ErrorResponseDto(400, 'No data returned from database');
      } else {
        const subscriberData: CreateSubscriberRequest = {
          firstName: data['first_name'],
          lastName: data['last_name'],
          mobile: data['mobile'],
          dateOfBirth: data['date_of_birth'],
          idNumber: data['id_number'],
          gender: data['gender'],
          source: 'Mukai-App'
        };
        await this.smileWalletService.createSubscriber(subscriberData);

      }

      return data as Subscriber;
    } catch (error) {
      return new ErrorResponseDto(500, error);
    }
  }

  async findAllSubscribers(): Promise<Subscriber[] | ErrorResponseDto> {
    try {
      const { data, error } = await this.postgresrest
        .from('zb_wallet_subscribers')
        .select()
        .order('created_at', { ascending: false });

      if (error) {
        this.logger.error('Error fetching subscribers', error);
        return new ErrorResponseDto(400, error.message);
      }

      return data as Subscriber[];
    } catch (error) {
      this.logger.error('Exception in findAllSubscriber', error);
      return new ErrorResponseDto(500, error);
    }
  }

  async viewSubscriber(id: string): Promise<Subscriber[] | ErrorResponseDto> {
    try {
      const { data, error } = await this.postgresrest
        .from('zb_wallet_subscribers')
        .select()
        .eq('id', id)
        .single();

      if (error) {
        this.logger.error(`Error fetching group ${id}`, error);
        return new ErrorResponseDto(400, error.message);
      }

      return data as Subscriber[];
    } catch (error) {
      this.logger.error(`Exception in viewSubscriber for id ${id}`, error);
      return new ErrorResponseDto(500, error);
    }
  }

  async updateSubscriber(
    id: string,
    updateSubscriberDto: UpdateSubscriberDto,
  ): Promise<Subscriber | ErrorResponseDto> {
    try {
      const { data, error } = await this.postgresrest
        .from('zb_wallet_subscribers')
        .update(updateSubscriberDto)
        .eq('id', id)
        .select()
        .single();
      if (error) {
        this.logger.error(`Error updating subscribers ${id}`, error);
        return new ErrorResponseDto(400, error.message);
      }
      return data as Subscriber;
    } catch (error) {
      this.logger.error(`Exception in updateSubscriber for id ${id}`, error);
      return new ErrorResponseDto(500, error);
    }
  }

  async deleteSubscriber(id: string): Promise<boolean | ErrorResponseDto> {
    try {
      const { error } = await this.postgresrest
        .from('zb_wallet_subscribers')
        .delete()
        .eq('id', id)
        .single();

      if (error) {
        this.logger.error(`Error deleting group ${id}`, error);
        return new ErrorResponseDto(400, error.message);
      }

      return true;
    } catch (error) {
      this.logger.error(`Exception in deleteSubscriber for id ${id}`, error);
      return new ErrorResponseDto(500, error);
    }
  }
}
