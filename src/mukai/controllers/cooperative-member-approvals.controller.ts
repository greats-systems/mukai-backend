/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  HttpException,
  // HttpStatus,
  UseGuards,
  Req,
  Headers,
  Query,
} from '@nestjs/common';
import { CooperativeMemberApprovalsService } from '../services/cooperative-member-approvals.service';
import { CreateCooperativeMemberApprovalsDto } from '../dto/create/create-cooperative-member-approvals.dto';
import { UpdateCooperativeMemberApprovalsDto } from '../dto/update/update-cooperative-member-approvals.dto';
import {
  ApiOperation,
  ApiBody,
  ApiResponse,
  ApiParam,
  ApiBearerAuth,
  ApiTags,
  ApiHeader,
  ApiExcludeEndpoint,
} from '@nestjs/swagger';
import { CooperativeMemberApprovals } from '../entities/cooperative-member-approvals.entity';
import { JwtAuthGuard } from 'src/auth/guards/jwt.auth.guard';
import { ErrorResponseDto } from 'src/common/dto/error-response.dto';
import { SuccessResponseDto } from 'src/common/dto/success-response.dto';

@ApiTags('Cooperative Member Approvals')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
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
@Controller('cooperative_member_approvals')
export class CooperativeMemberApprovalsController {
  constructor(
    private readonly cooperativeMemberApprovalsService: CooperativeMemberApprovalsService,
  ) { }

  @Post()
  @ApiOperation({ summary: 'Create a new member approval poll' })
  @ApiBody({ type: CreateCooperativeMemberApprovalsDto })
  @ApiResponse({
    status: 201,
    description: 'Poll created successfully',
    type: CooperativeMemberApprovals,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: 409,
    description: 'Conflict - poll already exists',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
    type: ErrorResponseDto,
  })
  async create(
    @Body()
    createCooperativeMemberApprovalsDto: CreateCooperativeMemberApprovalsDto,
    @Req() req,
    @Headers() headers,
  ) {
    const response =
      await this.cooperativeMemberApprovalsService.createCooperativeMemberApprovals(
        createCooperativeMemberApprovalsDto,
        req.user.sub,
        headers['x-platform'],
      );
    if (response instanceof ErrorResponseDto) {
      throw new HttpException(response.message!, response.statusCode);
    }
    return response;
  }

  @Get()
  @ApiOperation({ summary: 'List all approval polls' })
  @ApiResponse({
    status: 200,
    description: 'Array of all polls',
    type: [CooperativeMemberApprovals],
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid request parameters',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
    type: ErrorResponseDto,
  })
  async findAll(@Req() req, @Headers() headers,) {
    const response =
      await this.cooperativeMemberApprovalsService.findAllCooperativeMemberApprovals(req.user.sub, headers['x-platform']);
    if (response instanceof ErrorResponseDto) {
      throw new HttpException(response.message!, response.statusCode);
    }
    return response;
  }

  @Get('elections')
  @ApiOperation({ summary: 'Check active elections for a group' })
  @ApiParam({
    name: 'group_id',
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'Group ID to fetch polls for',
  })
  @ApiResponse({
    status: 200,
    description: 'Election details',
    type: SuccessResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid ID format',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Election not found',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
    type: ErrorResponseDto,
  })
  async checkActiveElections(
    @Query('group_id') group_id: string,
    @Query('member_id') member_id: string,
  ) {
    const response =
      await this.cooperativeMemberApprovalsService.checkActiveElections(
        group_id,
        member_id
      );
    if (response instanceof ErrorResponseDto) {
      throw new HttpException(response.message!, response.statusCode);
    }
    return response;
  }

  @Get('coop/:group_id')
  @ApiOperation({ summary: 'Get specific poll details for a group' })
  @ApiParam({
    name: 'group_id',
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'Group ID to fetch polls for',
  })
  @ApiResponse({
    status: 200,
    description: 'Poll details',
    type: SuccessResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid ID format',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Poll not found',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
    type: ErrorResponseDto,
  })
  async viewCooperativeMemberApprovalsByCoop(
    @Param('group_id') group_id: string,
    @Req() req,
    @Headers() headers,
  ) {
    const response =
      await this.cooperativeMemberApprovalsService.viewCooperativeMemberApprovalsByCoop(
        group_id,
        req.user.sub,
        headers['x-platform']
      );
    if (response instanceof ErrorResponseDto) {
      throw new HttpException(response.message!, response.statusCode);
    }
    return response;
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get specific poll details' })
  @ApiParam({
    name: 'id',
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'Poll ID',
  })
  @ApiResponse({
    status: 200,
    description: 'Poll details',
    type: [CooperativeMemberApprovals],
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid ID format',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Poll not found',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
    type: ErrorResponseDto,
  })
  async findOne(@Param('id') id: string) {
    const response =
      await this.cooperativeMemberApprovalsService.viewCooperativeMemberApprovals(
        id,
      );
    if (response instanceof ErrorResponseDto) {
      throw new HttpException(response.message!, response.statusCode);
    }
    return response;
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a poll' })
  @ApiParam({
    name: 'id',
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'Poll ID to update',
  })
  @ApiBody({ type: UpdateCooperativeMemberApprovalsDto })
  @ApiResponse({
    status: 200,
    description: 'Updated poll details',
    type: CooperativeMemberApprovals,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Poll not found',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
    type: ErrorResponseDto,
  })
  async update(
    @Param('id') id: string,
    @Body()
    updateCooperativeMemberApprovalsDto: UpdateCooperativeMemberApprovalsDto,
    @Req() req,
    @Headers() headers
  ) {
    const response =
      await this.cooperativeMemberApprovalsService.updateCooperativeMemberApprovals(
        id,
        updateCooperativeMemberApprovalsDto,
        req.user.sub,
        headers['x-platform']
      );
    if (response instanceof ErrorResponseDto) {
      throw new HttpException(response.message!, response.statusCode);
    }
    return response;
  }

  @ApiExcludeEndpoint()
  @Patch('coop/:coop_id')
  @ApiOperation({ summary: 'Update a poll by cooperative ID' })
  @ApiParam({
    name: 'coop_id',
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'Cooperative ID to update polls for',
  })
  @ApiBody({ type: UpdateCooperativeMemberApprovalsDto })
  @ApiResponse({
    status: 200,
    description: 'Updated poll details',
    type: Object,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Cooperative not found',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
    type: ErrorResponseDto,
  })
  async updateByCoopID(
    @Param('coop_id') coop_id: string,
    @Body()
    updateCooperativeMemberApprovalsDto: UpdateCooperativeMemberApprovalsDto,
  ) {
    const response =
      await this.cooperativeMemberApprovalsService.updateCooperativeMemberApprovalsByCoopID(
        coop_id,
        updateCooperativeMemberApprovalsDto,
      );
    if (response instanceof ErrorResponseDto) {
      throw new HttpException(response.message!, response.statusCode);
    }
    return response;
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a poll' })
  @ApiParam({
    name: 'id',
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'Poll ID to delete',
  })
  @ApiResponse({
    status: 200,
    description: 'Confirmation of deletion',
    schema: {
      example: { success: true, message: 'Poll deleted successfully' },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid ID format',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Poll not found',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
    type: ErrorResponseDto,
  })
  async delete(@Param('id') id: string) {
    const response =
      await this.cooperativeMemberApprovalsService.deleteCooperativeMemberApprovals(
        id,
      );
    if (response instanceof ErrorResponseDto) {
      throw new HttpException(response.message!, response.statusCode);
    }
    return { success: true, message: 'Poll deleted successfully' };
  }
}
