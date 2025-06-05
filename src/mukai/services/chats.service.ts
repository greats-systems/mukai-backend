/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-function-type */
import { Logger, Injectable } from '@nestjs/common';
import { ErrorResponseDto } from 'src/common/dto/error-response.dto';
import { PostgresRest } from 'src/common/postgresrest';
import { CreateChatDto } from '../dto/create/create-chat.dto';
import { UpdateChatDto } from '../dto/update/update-chat.dto';
import { Chat } from '../entities/chat.entity';

function initLogger(funcname: Function): Logger {
  return new Logger(funcname.name);
}

@Injectable()
export class ChatsService {
  private readonly logger = initLogger(ChatsService);
  constructor(private readonly postgresrest: PostgresRest) {}

  async createChat(
    createChatDto: CreateChatDto,
  ): Promise<Chat | ErrorResponseDto> {
    try {
      /*
      const Chat = new Chat();

      Chat.id ?: string;
      Chat.handling_smart_contract ?: string;
      Chat.is_collateral_required ?: boolean;
      Chat.requesting_account ?: string;
      Chat.offering_account ?: string;
      Chat.collateral_Chat_id ?: string;
      Chat.payment_due ?: string;
      Chat.payment_terms ?: string;
      Chat.amount ?: string;
      Chat.payments_handling_wallet_id ?: string;
      Chat.collateral_Chat_handler_id ?: string;
      Chat.collateral_Chat_handler_fee ?: string;

      Chat.provider_id = createChatDto.provider_id;
      Chat.Chat_name = createChatDto.Chat_name;
      Chat.unit_measure = createChatDto.unit_measure;
      Chat.unit_price = createChatDto.unit_price;
      Chat.max_capacity = createChatDto.max_capacity;

      // Check if the given Chat already exists
      if (await this.checkIfProductExists(Chat.provider_id)) {
        return new ErrorResponseDto(
          409,
          'You have already registered this Chat',
        );
      }
        */

      const { data, error } = await this.postgresrest
        .from('chats')
        .insert(createChatDto)
        .single();
      if (error) {
        console.log(error);
        return new ErrorResponseDto(400, error.message);
      }
      return data as Chat;
    } catch (error) {
      return new ErrorResponseDto(500, error);
    }
  }

  async findAllChats(): Promise<Chat[] | ErrorResponseDto> {
    try {
      const { data, error } = await this.postgresrest.from('chats').select();

      if (error) {
        this.logger.error('Error fetching Chats', error);
        return new ErrorResponseDto(400, error.message);
      }

      return data as Chat[];
    } catch (error) {
      this.logger.error('Exception in findAllChats', error);
      return new ErrorResponseDto(500, error);
    }
  }

  async viewChat(id: string): Promise<Chat | ErrorResponseDto> {
    try {
      const { data, error } = await this.postgresrest
        .from('chats')
        .select()
        .eq('id', id)
        .single();

      if (error) {
        this.logger.error(`Error fetching Chat ${id}`, error);
        return new ErrorResponseDto(400, error.message);
      }

      return data as Chat;
    } catch (error) {
      this.logger.error(`Exception in viewChat for id ${id}`, error);
      return new ErrorResponseDto(500, error);
    }
  }

  async updateChat(
    id: string,
    updateChatDto: UpdateChatDto,
  ): Promise<Chat | ErrorResponseDto> {
    try {
      const { data, error } = await this.postgresrest
        .from('chats')
        .update(updateChatDto)
        .eq('id', id)
        .select()
        .single();
      if (error) {
        this.logger.error(`Error updating Chats ${id}`, error);
        return new ErrorResponseDto(400, error.message);
      }
      return data as Chat;
    } catch (error) {
      this.logger.error(`Exception in updateChat for id ${id}`, error);
      return new ErrorResponseDto(500, error);
    }
  }

  async deleteChat(id: string): Promise<boolean | ErrorResponseDto> {
    try {
      const { error } = await this.postgresrest
        .from('chats')
        .delete()
        .eq('id', id)
        .single();

      if (error) {
        this.logger.error(`Error deleting Chat ${id}`, error);
        return new ErrorResponseDto(400, error.message);
      }

      return true;
    } catch (error) {
      this.logger.error(`Exception in deleteChat for id ${id}`, error);
      return new ErrorResponseDto(500, error);
    }
  }
}
