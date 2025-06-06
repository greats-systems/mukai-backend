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
import { CooperativeMemberRequestsService } from '../services/cooperative_member_requests.service';
import { CreateCooperativeMemberRequestDto } from '../dto/create/create-cooperative-member-request.dto';
import { UpdateCooperativeMemberRequestDto } from '../dto/update/update-cooperative-member-request.dto';
import { ErrorResponseDto } from 'src/common/dto/error-response.dto';

function isErrorResponseDto(obj: any): obj is ErrorResponseDto {
  return (
    obj &&
    typeof (obj as ErrorResponseDto).statusCode === 'number' &&
    typeof (obj as ErrorResponseDto).message === 'string'
  );
}

@Controller('cooperative-member-requests')
export class CooperativeMemberRequestsController {
  constructor(
    private readonly cooperativeMemberRequestsService: CooperativeMemberRequestsService,
  ) {}

  @Post()
  async create(
    @Body()
    createCooperativeMemberRequestDto: CreateCooperativeMemberRequestDto,
  ) {
    const response =
      await this.cooperativeMemberRequestsService.createCooperativeMemberRequest(
        createCooperativeMemberRequestDto,
      );
    if (response instanceof ErrorResponseDto) {
      throw new HttpException(
        response.message || 'An error occurred',
        response.statusCode,
      );
    }
    return response;
  }

  @Get()
  async findAll() {
    const response =
      await this.cooperativeMemberRequestsService.findAllCooperativeMemberRequests();
    if (response instanceof ErrorResponseDto) {
      throw new HttpException(
        response.message || 'An error occurred',
        response.statusCode,
      );
    }
    return response;
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const response =
      await this.cooperativeMemberRequestsService.viewCooperativeMemberRequest(
        id,
      );
    if (response instanceof ErrorResponseDto) {
      throw new HttpException(
        response.message || 'An error occurred',
        response.statusCode,
      );
    }
    return response;
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body()
    updateCooperativeMemberRequestDto: UpdateCooperativeMemberRequestDto,
  ) {
    const response =
      await this.cooperativeMemberRequestsService.updateCooperativeMemberRequest(
        id,
        updateCooperativeMemberRequestDto,
      );
    if (response instanceof ErrorResponseDto) {
      throw new HttpException(
        response.message || 'An error occurred',
        response.statusCode,
      );
    }
    return response;
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    const response = await this.cooperativeMemberRequestsService.deleteCooperativeMemberRequest(
      id,
    );
    if (response === true) {
      return { message: 'Deletion successful' };
    }
    if (isErrorResponseDto(response)) {
      throw new HttpException(
        response.message || 'An error occurred',
        response.statusCode,
      );
    }
    throw new HttpException('Unknown error', HttpStatus.INTERNAL_SERVER_ERROR);
  }
}
