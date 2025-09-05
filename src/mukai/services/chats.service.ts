/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-function-type */
import { Logger, Injectable } from '@nestjs/common';
import { ErrorResponseDto } from 'src/common/dto/error-response.dto';
import { PostgresRest } from 'src/common/postgresrest';
import { CreateChatDto } from '../dto/create/create-chat.dto';
import { UpdateChatDto } from '../dto/update/update-chat.dto';
import { Chat } from '../entities/chat.entity';
import { v4 as uuidv4 } from 'uuid';
import { SuccessResponseDto } from 'src/common/dto/success-response.dto';

function initLogger(funcname: Function): Logger {
  return new Logger(funcname.name);
}

@Injectable()
export class ChatsService {
  private readonly logger = initLogger(ChatsService);
  constructor(private readonly postgresrest: PostgresRest) {}

  async createChat(
    createChatDto: CreateChatDto,
  ): Promise<SuccessResponseDto | ErrorResponseDto> {
    console.warn(createChatDto);
    try {
      const processedDto = {
        ...createChatDto,
        // receiver_id: createChatDto.receiver_id || uuidv4(),
        profile_id: createChatDto.profile_id || uuidv4(),
        receiver_avatar_id: createChatDto.receiver_avatar_id || uuidv4(),
        profile_avatar_id: createChatDto.profile_avatar_id || uuidv4(),
      };
      const { data, error } = await this.postgresrest
        .from('chats')
        .insert(processedDto)
        .single();
      if (error) {
        console.log('createChat error:');
        console.log(error);
        return new ErrorResponseDto(400, error.details);
      }
      return {
        statusCode: 201,
        message: 'Chat created successfully',
        data: data as Chat,
      };
    } catch (error) {
      return new ErrorResponseDto(500, error);
    }
  }

  async findAllChats(): Promise<SuccessResponseDto | ErrorResponseDto> {
    try {
      const { data, error } = await this.postgresrest.from('chats').select();

      if (error) {
        this.logger.error('Error fetching Chats', error);
        return new ErrorResponseDto(400, error.details);
      }

      return {
        statusCode: 200,
        message: 'Chats fetched successfully',
        data: data as Chat[],
      };
    } catch (error) {
      this.logger.error('Exception in findAllChats', error);
      return new ErrorResponseDto(500, error);
    }
  }

  async viewChat(id: string): Promise<SuccessResponseDto | ErrorResponseDto> {
    try {
      const { data, error } = await this.postgresrest
        .from('chats')
        .select()
        .eq('id', id)
        .single();

      if (error) {
        this.logger.error(`Error fetching Chat ${id}`, error);
        return new ErrorResponseDto(400, error.details);
      }

      return {
        statusCode: 200,
        message: 'Chat fetched successfully',
        data: data as Chat,
      };
    } catch (error) {
      this.logger.error(`Exception in viewChat for id ${id}`, error);
      return new ErrorResponseDto(500, error);
    }
  }

  async updateChat(
    id: string,
    updateChatDto: UpdateChatDto,
  ): Promise<SuccessResponseDto | ErrorResponseDto> {
    try {
      const { data, error } = await this.postgresrest
        .from('chats')
        .update(updateChatDto)
        .eq('id', id)
        .select()
        .single();
      if (error) {
        this.logger.error(`Error updating Chats ${id}`, error);
        return new ErrorResponseDto(400, error.details);
      }
      return {
        statusCode: 200,
        message: 'Chat updated successfully',
        data: data as Chat,
      };
    } catch (error) {
      this.logger.error(`Exception in updateChat for id ${id}`, error);
      return new ErrorResponseDto(500, error);
    }
  }

  async deleteChat(id: string): Promise<SuccessResponseDto | ErrorResponseDto> {
    try {
      const { error } = await this.postgresrest
        .from('chats')
        .delete()
        .eq('id', id)
        .single();

      if (error) {
        this.logger.error(`Error deleting Chat ${id}`, error);
        return new ErrorResponseDto(400, error.details);
      }

      return {
        statusCode: 200,
        message: 'Chat deleted successfully',
      };
    } catch (error) {
      this.logger.error(`Exception in deleteChat for id ${id}`, error);
      return new ErrorResponseDto(500, error);
    }
  }
}
