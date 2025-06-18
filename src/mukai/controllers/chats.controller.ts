import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
} from '@nestjs/swagger';
import { ChatsService } from '../services/chats.service';
import { CreateChatDto } from '../dto/create/create-chat.dto';
import { UpdateChatDto } from '../dto/update/update-chat.dto';
import { Chat } from '../entities/chat.entity';

@ApiTags('Chats')
@Controller('chats')
export class ChatsController {
  constructor(private readonly chatsService: ChatsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new chat session' })
  @ApiBody({ type: CreateChatDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Chat created successfully',
    type: Chat,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Server error',
  })
  async create(@Body() createChatDto: CreateChatDto) {
    const response = await this.chatsService.createChat(createChatDto);
    if (response['statusCode'] === 400) {
      throw new HttpException(
        response['message'] ?? 'Bad request',
        HttpStatus.BAD_REQUEST,
      );
    }
    if (response['statusCode'] === 500) {
      throw new HttpException(
        response['message'] ?? 'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    return response;
  }

  @Get()
  @ApiOperation({ summary: 'List all chat sessions' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Array of chat sessions',
    type: [Chat],
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Server error',
  })
  async findAll() {
    const response = await this.chatsService.findAllChats();
    if (response['statusCode'] === 500) {
      throw new HttpException(
        response['message'] ?? 'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    return response;
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get chat details by ID' })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'Chat ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Chat details',
    type: Chat,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Chat not found',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Server error',
  })
  async findOne(@Param('id') id: string) {
    const response = await this.chatsService.viewChat(id);
    if (response['statusCode'] === 404) {
      throw new HttpException(
        response['message'] ?? 'Chat not found',
        HttpStatus.NOT_FOUND,
      );
    }
    if (response['statusCode'] === 500) {
      throw new HttpException(
        response['message'] ?? 'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    return response;
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a chat session' })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'Chat ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiBody({ type: UpdateChatDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Updated chat details',
    type: Chat,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Chat not found',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Server error',
  })
  async update(@Param('id') id: string, @Body() updateChatDto: UpdateChatDto) {
    const response = await this.chatsService.updateChat(id, updateChatDto);
    if (response['statusCode'] === 400) {
      throw new HttpException(
        response['message'] ?? 'Bad request',
        HttpStatus.BAD_REQUEST,
      );
    }
    if (response['statusCode'] === 404) {
      throw new HttpException(
        response['message'] ?? 'Chat not found',
        HttpStatus.NOT_FOUND,
      );
    }
    if (response['statusCode'] === 500) {
      throw new HttpException(
        response['message'] ?? 'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    return response;
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a chat session' })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'Chat ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Confirmation of deletion',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Chat not found',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Server error',
  })
  async delete(@Param('id') id: string) {
    const response = await this.chatsService.deleteChat(id);
    if (response['statusCode'] === 404) {
      throw new HttpException(
        response['message'] ?? 'Chat not found',
        HttpStatus.NOT_FOUND,
      );
    }
    if (response['statusCode'] === 500) {
      throw new HttpException(
        response['message'] ?? 'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    return response;
  }
}
