/* eslint-disable @typescript-eslint/no-unsafe-argument */
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
import { CreateSpendingConditionsDto } from '../dto/create/create-spending-conditions.dto';
import { UpdateSpendingConditionsDto } from '../dto/update/update-spending-conditions.dto';
import { SpendingConditionsService } from '../services/spending-conditions.service';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
} from '@nestjs/swagger';
import { SpendingConditions } from '../entities/spending-conditions.entity';

@ApiTags('Spending Conditions')
@Controller('groups')
export class SpendingConditionsController {
  constructor(private readonly groupsService: SpendingConditionsService) {}

  @Post()
  @ApiOperation({ summary: 'Create spending conditions' })
  @ApiBody({ type: CreateSpendingConditionsDto })
  @ApiResponse({
    status: 201,
    description: 'Spending conditions created successfully',
    type: SpendingConditions,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  async create(
    @Body() createSpendingConditionsDto: CreateSpendingConditionsDto,
  ) {
    const response = await this.groupsService.createSpendingConditions(
      createSpendingConditionsDto,
    );
    if (response['statusCode'] === 400) {
      throw new HttpException(response['message'], HttpStatus.BAD_REQUEST);
    }
    if (response['statusCode'] === 500) {
      throw new HttpException(
        response['message'],
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    return response;
  }

  @Get()
  @ApiOperation({ summary: 'List all spending conditions' })
  @ApiResponse({
    status: 200,
    description: 'Array of spending conditions',
    type: [SpendingConditions],
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid request',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  async findAll() {
    const response = await this.groupsService.findAllSpendingConditions();
    if (response['statusCode'] === 400) {
      throw new HttpException(response['message'], HttpStatus.BAD_REQUEST);
    }
    if (response['statusCode'] === 500) {
      throw new HttpException(
        response['message'],
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    return response;
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get spending conditions details' })
  @ApiParam({
    name: 'id',
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'Spending conditions ID',
  })
  @ApiResponse({
    status: 200,
    description: 'Spending conditions details',
    type: SpendingConditions,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid ID format',
  })
  @ApiResponse({
    status: 404,
    description: 'Spending conditions not found',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  async findOne(@Param('id') id: string) {
    const response = await this.groupsService.viewSpendingConditions(id);
    if (response['statusCode'] === 400) {
      throw new HttpException(response['message'], HttpStatus.BAD_REQUEST);
    }
    if (response['statusCode'] === 500) {
      throw new HttpException(
        response['message'],
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    return response;
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update spending conditions' })
  @ApiParam({
    name: 'id',
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'Spending conditions ID',
  })
  @ApiBody({ type: UpdateSpendingConditionsDto })
  @ApiResponse({
    status: 200,
    description: 'Updated spending conditions details',
    type: SpendingConditions,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data',
  })
  @ApiResponse({
    status: 404,
    description: 'Spending conditions not found',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  async update(
    @Param('id') id: string,
    @Body() updateSpendingConditionsDto: UpdateSpendingConditionsDto,
  ) {
    const response = await this.groupsService.updateSpendingConditions(
      id,
      updateSpendingConditionsDto,
    );
    if (response['statusCode'] === 400) {
      throw new HttpException(response['message'], HttpStatus.BAD_REQUEST);
    }
    if (response['statusCode'] === 500) {
      throw new HttpException(
        response['message'],
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    return response;
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete spending conditions' })
  @ApiParam({
    name: 'id',
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'Spending conditions ID',
  })
  @ApiResponse({
    status: 200,
    description: 'Spending conditions deleted successfully',
    type: SpendingConditions,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data',
  })
  @ApiResponse({
    status: 404,
    description: 'Spending conditions not found',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  async delete(@Param('id') id: string) {
    const response = await this.groupsService.deleteSpendingConditions(id);
    if (response['statusCode'] === 400) {
      throw new HttpException(response['message'], HttpStatus.BAD_REQUEST);
    }
    if (response['statusCode'] === 500) {
      throw new HttpException(
        response['message'],
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    return response;
  }
}
