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
      const { data, error } = await this.postgresrest
        .from('chats')
        .insert(createChatDto)
        .single();
      if (error) {
        console.log('createChat error:');
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
