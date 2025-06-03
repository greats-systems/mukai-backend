/* eslint-disable @typescript-eslint/no-unsafe-argument */
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { CreateProducerDto } from '../dto/create/create-producer.dto';
import { ProducerService } from '../services/producers.service';
import {
  ApiOperation,
  ApiBody,
  ApiCreatedResponse,
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiNotFoundResponse,
  ApiParam,
} from '@nestjs/swagger';
import { ErrorResponseDto } from 'src/common/dto/error-response.dto';
import { Producer } from '../entities/producer.entity';

@Controller('producer')
export class ProducerController {
  constructor(private readonly producerService: ProducerService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new producer' })
  @ApiBody({ type: CreateProducerDto })
  @ApiCreatedResponse({
    description: 'Producer created successfully',
    type: [Producer],
  })
  @ApiBadRequestResponse({
    description: 'Invalid input data',
    type: ErrorResponseDto,
    // content: {
    //   'application/json': {
    //     example: {
    //       statusCode: 400,
    //       message: 'Invalid input data',
    //       errorObject: {
    //         message: 'invalid input syntax',
    //         details: null,
    //         hint: null,
    //         code: '22P02',
    //       },
    //     },
    //   },
    // },
  })
  @ApiConflictResponse({
    description: 'Producer already exists',
    type: ErrorResponseDto,
    content: {
      'application/json': {
        example: {
          statusCode: 409,
          message: 'Conflict: Producer already exists',
        },
      },
    },
  })
  @ApiInternalServerErrorResponse({
    description: 'Server error',
    type: ErrorResponseDto,
    content: {
      'application/json': {
        example: {
          statusCode: 500,
          message: 'Internal server error',
          errorObject: {
            message: 'connection error',
            details: 'Failed to connect to database',
            hint: 'Check database connection',
            code: '08006',
          },
        },
      },
    },
  })
  async create(@Body() createProducerDto: CreateProducerDto) {
    const response =
      await this.producerService.createProducer(createProducerDto);
    if (response['statusCode'] == 400) {
      throw new HttpException(response['message'], HttpStatus.BAD_REQUEST);
    }
    if (response['statusCode'] == 409) {
      throw new HttpException(response['message'], HttpStatus.CONFLICT);
    }
    if (response['statusCode'] == 500) {
      throw new HttpException(
        response['message'],
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    return response;
  }

  @Get()
  @ApiOperation({ summary: 'Get all producers' })
  @ApiOkResponse({
    description: 'List of all producers',
    type: [Producer],
  })
  @ApiBadRequestResponse({
    description: 'Invalid request',
    type: ErrorResponseDto,
  })
  @ApiInternalServerErrorResponse({
    description: 'Server error',
    type: ErrorResponseDto,
  })
  async findAll() {
    const response = await this.producerService.findAllProducers();
    if (response['statusCode'] == 400) {
      throw new HttpException(response['message'], HttpStatus.BAD_REQUEST);
    }
    if (response['statusCode'] == 500) {
      throw new HttpException(
        response['message'],
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    return response;
  }

  @Get(':producer_id')
  @ApiOperation({ summary: 'Get a specific producer' })
  @ApiParam({
    name: 'producer_id',
    type: String,
    description: 'Producer ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiOkResponse({
    description: 'Producer details',
    type: Producer,
  })
  @ApiNotFoundResponse({
    description: 'Producer not found',
    type: ErrorResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Invalid producer ID',
    type: ErrorResponseDto,
  })
  @ApiInternalServerErrorResponse({
    description: 'Server error',
    type: ErrorResponseDto,
  })
  async findOne(@Param('producer_id') producer_id: string) {
    const response = await this.producerService.viewProducer(producer_id);
    if (response['statusCode'] == 400) {
      throw new HttpException(response['message'], HttpStatus.BAD_REQUEST);
    }
    if (response['statusCode'] == 500) {
      throw new HttpException(
        response['message'],
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    return response;
  }
}
