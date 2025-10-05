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
  ApiHeader,
} from '@nestjs/swagger';
import { CooperativeMemberRequest } from '../entities/cooperative-member-request.entity';
import { JwtAuthGuard } from 'src/auth/guards/jwt.auth.guard';

@ApiTags('Cooperative Member Requests')
// @UseGuards(JwtAuthGuard)
// @ApiBearerAuth()
@ApiHeader({
  name: 'apikey',
  description: 'API key for authentication (insert access token)',
  required: true, // Set to true if the header is mandatory
  example:
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJodHRwczovL2V4YW1wbGUuYXV0aDAuY29tLyIsImF1ZCI6Imh0dHBzOi8vYXBpLmVkY2Fyd2FyZS5jb20vY2FsZW5kYXIvdjEvIiwic3ViIjoidXNyXzEyMyIsImlhdCI6MTQ1ODc4NTc5NiwiZXhwIjoxNDU4ODcyMTk2fQ.CA7eaHjIHz5NxeIJoFK9krqaeZrPLwmMmgI_XiQiIkQ', // Optional: provide an example value
})
@ApiHeader({
  name: 'Authorization',
  description: 'Bearer token for authentication (insert access token)',
  required: true, // Set to true if the header is mandatory
  example:
    'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJodHRwczovL2V4YW1wbGUuYXV0aDAuY29tLyIsImF1ZCI6Imh0dHBzOi8vYXBpLmVkY2Fyd2FyZS5jb20vY2FsZW5kYXIvdjEvIiwic3ViIjoidXNyXzEyMyIsImlhdCI6MTQ1ODc4NTc5NiwiZXhwIjoxNDU4ODcyMTk2fQ.CA7eaHjIHz5NxeIJoFK9krqaeZrPLwmMmgI_XiQiIkQ', // Optional: provide an example value
})
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

  @Get('/invitations/:member_id')
  @ApiOperation({ summary: 'Get cooperative invitations for a member' })
  @ApiParam({
    name: 'member_id',
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'Member ID to retrieve invitations for',
  })
  @ApiResponse({
    status: 200,
    description: 'Array of cooperative invitations',
    type: [CooperativeMemberRequest],
  })
  @ApiResponse({
    status: 404,
    description: 'No invitations found',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
    type: ErrorResponseDto,
  })
  async findCooperativeInvitations(@Param('member_id') member_id: string) {
    const response =
      await this.cooperativeMemberRequestsService.findCooperativeInvitations(
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

  @Get('/pending/:member_id')
  @ApiOperation({
    summary: 'Get pending request from user who wants to join group',
  })
  @ApiParam({
    name: 'member_id',
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'Member ID to check for pending requests',
  })
  @ApiResponse({
    status: 200,
    description: 'Pending request details',
    type: CooperativeMemberRequest,
  })
  @ApiResponse({
    status: 404,
    description: 'No pending requests found',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
    type: ErrorResponseDto,
  })
  async getPendingRequestDetails(@Param('member_id') member_id: string) {
    const response =
      await this.cooperativeMemberRequestsService.findCooperativeRequests(
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

  @Get(':group_id/:status')
  @ApiOperation({ summary: 'Get member requests by group and status' })
  @ApiParam({
    name: 'group_id',
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'Group ID to filter requests',
  })
  @ApiParam({
    name: 'status',
    example: 'unresolved',
    description: 'Status to filter requests',
    enum: ['unresolved', 'approved', 'rejected', 'invited'],
  })
  @ApiResponse({
    status: 200,
    description: 'Array of filtered requests',
    type: [CooperativeMemberRequest],
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid status parameter',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'No requests found for the given criteria',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
    type: ErrorResponseDto,
  })
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

  @Patch()
  @ApiOperation({ summary: 'Update a member request' })
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
    description: 'Request ID to delete',
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
