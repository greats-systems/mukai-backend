/* eslint-disable @typescript-eslint/no-unsafe-argument */

import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Injectable,
  Param,
  Post,
} from '@nestjs/common';
import { CreatePayslipDto } from '../dto/create/create-payslip.dto';
import { PayslipsService } from '../services/payslip.service';
import { ErrorResponseDto } from 'src/common/dto/error-response.dto';

@Injectable()
@Controller('payslips')
export class PayslipsController {
  constructor(private readonly payslipsService: PayslipsService) {}

  @Post()
  async create(
    @Body()
    createPayslipsDto: CreatePayslipDto,
  ) {
    const response =
      await this.payslipsService.createPayslip(createPayslipsDto);
    if (response instanceof ErrorResponseDto) {
      if (response.statusCode == 400) {
        throw new HttpException(
          response.message ?? 'Bad request',
          HttpStatus.BAD_REQUEST,
        );
      }
      if (response.statusCode == 403) {
        throw new HttpException(
          response.message ?? 'Not found',
          HttpStatus.FORBIDDEN,
        );
      }
      if (response.statusCode == 404) {
        throw new HttpException(
          response.message ?? 'Not found',
          HttpStatus.NOT_FOUND,
        );
      }
      if (response.statusCode == 409) {
        throw new HttpException(
          response.message ?? 'Conflict',
          HttpStatus.CONFLICT,
        );
      }
      if (response.statusCode == 500) {
        throw new HttpException(
          response.message ?? 'Internal Server Error',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
    return response;
  }

  @Get()
  async findAll() {
    const response = await this.payslipsService.findAllPayslips();
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

  @Get('id')
  async findOne(@Param('id') id: string) {
    const response = await this.payslipsService.viewPayslip(id);
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

  @Get('summary')
  async viewPayrollSummary() {
    const response = await this.payslipsService.viewPayrollSummary();
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
