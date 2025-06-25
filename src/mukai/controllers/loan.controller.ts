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
import { CreateLoanDto } from '../dto/create/create-loan.dto';
import { UpdateLoanDto } from '../dto/update/update-loan.dto';
import { LoanService } from '../services/loan.servce';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
} from '@nestjs/swagger';
import { Loan } from '../entities/loan.entity';

@ApiTags('Loans')
@Controller('loans')
export class LoanController {
  constructor(private readonly loanService: LoanService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new loan' })
  @ApiBody({ type: CreateLoanDto })
  @ApiResponse({
    status: 201,
    description: 'Loan created successfully',
    type: Loan,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  async create(@Body() createLoanDto: CreateLoanDto) {
    const response = await this.loanService.createLoan(createLoanDto);
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
  @ApiOperation({ summary: 'List all loans' })
  @ApiResponse({
    status: 200,
    description: 'Array of loans',
    type: [Loan],
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
    const response = await this.loanService.findAllLoans();
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
  @ApiOperation({ summary: 'Get loan details' })
  @ApiParam({
    name: 'id',
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'Loan ID',
  })
  @ApiResponse({
    status: 200,
    description: 'Loan details',
    type: Loan,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid ID format',
  })
  @ApiResponse({
    status: 404,
    description: 'Loan not found',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  async findOne(@Param('id') id: string) {
    const response = await this.loanService.viewLoan(id);
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

  @Get('profile/:profile_id')
  @ApiOperation({ summary: 'Get profile loan details' })
  @ApiParam({
    name: 'profile_id',
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'Profile ID',
  })
  @ApiResponse({
    status: 200,
    description: 'Loan details',
    type: Loan,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid ID format',
  })
  @ApiResponse({
    status: 404,
    description: 'Loan not found',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  async viewProfileLoan(@Param('profile_id') profile_id: string) {
    const response = await this.loanService.viewProfileLoan(profile_id);
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
  @ApiOperation({ summary: 'Update a loan' })
  @ApiParam({
    name: 'id',
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'Loan ID',
  })
  @ApiBody({ type: UpdateLoanDto })
  @ApiResponse({
    status: 200,
    description: 'Updated loan details',
    type: Loan,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data',
  })
  @ApiResponse({
    status: 404,
    description: 'Loan not found',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  async update(@Param('id') id: string, @Body() updateLoanDto: UpdateLoanDto) {
    const response = await this.loanService.updateLoan(id, updateLoanDto);
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
  @ApiOperation({ summary: 'Delete a loan' })
  @ApiParam({
    name: 'id',
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'Loan ID',
  })
  @ApiResponse({
    status: 200,
    description: 'Loan deleted successfully',
    type: Loan,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data',
  })
  @ApiResponse({
    status: 404,
    description: 'Loan not found',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  async delete(@Param('id') id: string) {
    const response = await this.loanService.deleteLoan(id);
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
