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
import { CooperativeMemberApprovalsService } from '../services/cooperative-member-approvals.service';
import { CreateCooperativeMemberApprovalsDto } from '../dto/create/create-cooperative-member-approvals.dto';
import { UpdateCooperativeMemberApprovalsDto } from '../dto/update/update-cooperative-member-approvals.dto';

@Controller('cooperative-member-approvals')
export class CooperativeMemberApprovalsController {
  constructor(
    private readonly cooperativeMemberApprovalsService: CooperativeMemberApprovalsService,
  ) {}

  @Post()
  async create(
    @Body()
    createCooperativeMemberApprovalsDto: CreateCooperativeMemberApprovalsDto,
  ) {
    const response =
      await this.cooperativeMemberApprovalsService.createCooperativeMemberApprovals(
        createCooperativeMemberApprovalsDto,
      );
    /*
    if (response['statusCode'] === 400) {
      throw new HttpException(response['message'], HttpStatus.BAD_REQUEST);
    }
    if (response['statusCode'] === 500) {
      throw new HttpException(response['message'], HttpStatus.INTERNAL_SERVER_ERROR);
    }
      */
    return response;
  }

  @Get()
  async findAll() {
    const response =
      await this.cooperativeMemberApprovalsService.findAllCooperativeMemberApprovals();
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
  async findOne(@Param('id') id: string) {
    const response =
      await this.cooperativeMemberApprovalsService.viewCooperativeMemberApprovals(
        id,
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

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body()
    updateCooperativeMemberApprovalsDto: UpdateCooperativeMemberApprovalsDto,
  ) {
    const response =
      await this.cooperativeMemberApprovalsService.updateCooperativeMemberApprovals(
        id,
        updateCooperativeMemberApprovalsDto,
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
  async delete(@Param('id') id: string) {
    const response =
      await this.cooperativeMemberApprovalsService.deleteCooperativeMemberApprovals(
        id,
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
}
