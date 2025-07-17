/* eslint-disable @typescript-eslint/no-unsafe-return */
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
  UseGuards,
} from '@nestjs/common';
import { CooperativeMemberRequestsService } from '../services/cooperative_member_requests.service';
import { CreateCooperativeMemberRequestDto } from '../dto/create/create-cooperative-member-request.dto';
import { UpdateCooperativeMemberRequestDto } from '../dto/update/update-cooperative-member-request.dto';
import { ErrorResponseDto } from 'src/common/dto/error-response.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { CooperativeMemberRequest } from '../entities/cooperative-member-request.entity';
import { JwtAuthGuard } from 'src/auth/guards/jwt.auth.guard';

@ApiTags('Cooperative Member Requests')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Controller('cooperative_member_requests')
export class CooperativeMemberRequestsController {
  constructor(
    private readonly cooperativeMemberRequestsService: CooperativeMemberRequestsService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new member request' })
  @ApiBody({ type: CreateCooperativeMemberRequestDto })
  @ApiResponse({
    status: 201,
    description: 'Request created successfully',
    type: CooperativeMemberRequest,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
    type: ErrorResponseDto,
  })
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
  @ApiOperation({ summary: 'List all member requests' })
  @ApiResponse({
    status: 200,
    description: 'Array of requests',
    type: [CooperativeMemberRequest],
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
    type: ErrorResponseDto,
  })
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

  @Get(':group_id/:status')
  async findMemberRequestStatus(
    @Param('group_id') group_id: string,
    @Param('status') status: string,
  ) {
    const response =
      await this.cooperativeMemberRequestsService.findMemberRequestStatus(
        group_id,
        status,
      );
    if (response instanceof ErrorResponseDto) {
      throw new HttpException(
        response.message || 'An error occurred',
        response.statusCode,
      );
    }
    return response;
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get specific request details' })
  @ApiParam({
    name: 'id',
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'Request ID',
  })
  @ApiResponse({
    status: 200,
    description: 'Request details',
    type: CooperativeMemberRequest,
  })
  @ApiResponse({
    status: 404,
    description: 'Request not found',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
    type: ErrorResponseDto,
  })
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

  @Get('/pending/:member_id')
  @ApiOperation({
    summary: 'Get pending request from user who wants to join group',
  })
  @ApiParam({
    name: 'member_id',
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'Member ID',
  })
  @ApiResponse({
    status: 200,
    description: 'Pending request details',
    type: CooperativeMemberRequest,
  })
  @ApiResponse({
    status: 404,
    description: 'No pending requests',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
    type: ErrorResponseDto,
  })
  async getPendingRequestDetails(@Param('member_id') member_id: string) {
    const response =
      await this.cooperativeMemberRequestsService.getPendingRequestDetails(
        member_id,
      );
    if (response instanceof ErrorResponseDto) {
      throw new HttpException(
        response.message || 'An error occurred',
        response.statusCode,
      );
    }
    return response;
  }

  @Patch()
  @ApiOperation({ summary: 'Update a member request' })
  @ApiParam({
    name: 'id',
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'Request ID',
  })
  @ApiBody({ type: UpdateCooperativeMemberRequestDto })
  @ApiResponse({
    status: 200,
    description: 'Updated request details',
    type: CooperativeMemberRequest,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Request not found',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
    type: ErrorResponseDto,
  })
  async update(
    // @Param('id') id: string,
    @Body()
    updateCooperativeMemberRequestDto: UpdateCooperativeMemberRequestDto,
  ) {
    const response =
      await this.cooperativeMemberRequestsService.updateCooperativeMemberRequest(
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
  @ApiOperation({ summary: 'Delete a member request' })
  @ApiParam({
    name: 'id',
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'Request ID',
  })
  @ApiResponse({
    status: 200,
    description: 'Deletion successful',
    schema: { example: { message: 'Deletion successful' } },
  })
  @ApiResponse({
    status: 404,
    description: 'Request not found',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
    type: ErrorResponseDto,
  })
  async delete(@Param('id') id: string) {
    const response =
      await this.cooperativeMemberRequestsService.deleteCooperativeMemberRequest(
        id,
      );
    if (response instanceof ErrorResponseDto) {
      throw new HttpException(
        response.message || 'An error occurred',
        response.statusCode,
      );
    }
    throw new HttpException('Unknown error', HttpStatus.INTERNAL_SERVER_ERROR);
  }
}
