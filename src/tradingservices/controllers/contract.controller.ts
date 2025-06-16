/* eslint-disable @typescript-eslint/no-unsafe-argument */
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBody,
  ApiParam,
  ApiCreatedResponse,
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';
import { ContractService } from '../services/contracts.service';
import { CreateContractDto } from '../dto/create/create-contract.dto';
import { UpdateContractDto } from '../dto/update/update-contract.dto';
import { Contract } from '../entities/contract.entity';
import { ErrorResponseDto } from 'src/common/dto/error-response.dto';

/**
 * Controller handling HTTP requests for contract operations
 */
@ApiTags('Contracts')
@Controller('contract')
export class ContractController {
  constructor(private readonly contractService: ContractService) {}

  /*
   * Creates a new contract
   * @param createContractDto Data for contract creation
   * @returns Created contract or error
   * @throws HttpException for various error cases
   */
  @Post()
  @ApiOperation({ summary: 'Create a new contract' })
  @ApiBody({ type: CreateContractDto })
  @ApiCreatedResponse({
    description: 'Contract created successfully',
    type: Contract,
  })
  @ApiBadRequestResponse({
    description: 'Invalid input data',
    type: ErrorResponseDto,
  })
  @ApiConflictResponse({
    description: 'Producer already has a contract',
    type: ErrorResponseDto,
  })
  @ApiInternalServerErrorResponse({
    description: 'Server error',
    type: ErrorResponseDto,
  })
  async create(@Body() createContractDto: CreateContractDto) {
    const response =
      await this.contractService.createContract(createContractDto);
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

  /*
   * Retrieves all contracts
   * @returns Array of contracts or error
   * @throws HttpException for error cases
   */
  @Get()
  @ApiOperation({ summary: 'Get all contracts' })
  @ApiOkResponse({
    description: 'List of all contracts',
    type: [Contract],
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
    const response = await this.contractService.findAllContracts();
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

  /*
   * Retrieves a specific contract by ID
   * @param contract_id ID of the contract to retrieve
   * @returns The requested contract or error
   * @throws HttpException for error cases
   */
  @Get(':contract_id')
  @ApiOperation({ summary: 'Get a specific contract' })
  @ApiParam({
    name: 'contract_id',
    type: String,
    description: 'Contract ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiOkResponse({
    description: 'Contract details',
    type: Contract,
  })
  @ApiNotFoundResponse({
    description: 'Contract not found',
    type: ErrorResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Invalid contract ID',
    type: ErrorResponseDto,
  })
  @ApiInternalServerErrorResponse({
    description: 'Server error',
    type: ErrorResponseDto,
  })
  async findOne(@Param('contract_id') contract_id: string) {
    const response = await this.contractService.viewContract(contract_id);
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

  /*
   * Updates an existing contract
   * @param contract_id ID of the contract to update
   * @param updateContractDto Data for contract update
   * @returns Updated contract or error
   * @throws HttpException for error cases
   */
  @Patch(':contract_id')
  @ApiOperation({ summary: 'Update a contract' })
  @ApiParam({
    name: 'contract_id',
    type: String,
    description: 'Contract ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiBody({ type: UpdateContractDto })
  @ApiOkResponse({
    description: 'Contract updated successfully',
    type: Contract,
  })
  @ApiNotFoundResponse({
    description: 'Contract not found',
    type: ErrorResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Invalid input data',
    type: ErrorResponseDto,
  })
  @ApiInternalServerErrorResponse({
    description: 'Server error',
    type: ErrorResponseDto,
  })
  async update(
    @Param('contract_id') contract_id: string,
    @Body() updateContractDto: UpdateContractDto,
  ) {
    const response = await this.contractService.updateContract(
      contract_id,
      updateContractDto,
    );
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

  /*
   * Deletes a contract by ID
   * @param contract_id ID of the contract to delete
   * @returns Success indicator or error
   * @throws HttpException for error cases
   */
  @Delete(':contract_id')
  @ApiOperation({ summary: 'Delete a contract' })
  @ApiParam({
    name: 'contract_id',
    type: String,
    description: 'Contract ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiOkResponse({
    description: 'Contract deleted successfully',
    // type: boolean,
  })
  @ApiNotFoundResponse({
    description: 'Contract not found',
    type: ErrorResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Invalid contract ID',
    type: ErrorResponseDto,
  })
  @ApiInternalServerErrorResponse({
    description: 'Server error',
    type: ErrorResponseDto,
  })
  async delete(@Param('contract_id') contract_id: string) {
    const response = await this.contractService.deleteContract(contract_id);
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
