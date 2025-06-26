/* eslint-disable @typescript-eslint/no-unsafe-argument */

import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Injectable,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { EmployeesService } from '../services/employee.service';
import { CreateEmployeeDto } from '../dto/create/create-employee.dto';
import { UpdateEmployeeDto } from '../dto/update/update-employee.dto';
import { ErrorResponseDto } from 'src/common/dto/error-response.dto';

@Injectable()
@Controller('employees')
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) {}

  @Post()
  async create(
    @Body()
    createEmployeesDto: CreateEmployeeDto,
  ) {
    const response =
      await this.employeesService.createEmployee(createEmployeesDto);
    if (response instanceof ErrorResponseDto) {
      if (response.statusCode == 400) {
        throw new HttpException(response.message!, HttpStatus.BAD_REQUEST);
      }
      if (response.statusCode == 403) {
        throw new HttpException(response.message!, HttpStatus.FORBIDDEN);
      }
      if (response.statusCode == 409) {
        throw new HttpException(response.message!, HttpStatus.CONFLICT);
      }
      if (response.statusCode == 500) {
        throw new HttpException(
          response.message!,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
    return response;
  }

  @Get()
  async findAll() {
    const response = await this.employeesService.findAllEmployees();
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
    const response = await this.employeesService.viewEmployee(id);
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

  @Patch('id')
  async update(
    @Param('id') id: string,
    @Body()
    updateEmployeesDto: UpdateEmployeeDto,
  ) {
    const response = await this.employeesService.updateEmployee(
      id,
      updateEmployeesDto,
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

  @Delete('id')
  delete(@Param('id') id: string) {
    const response = this.employeesService.deleteEmployee(id);
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
