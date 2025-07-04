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
  UseGuards,
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
} from '@nestjs/swagger';
import { CooperativeMemberApprovals } from '../entities/cooperative-member-approvals.entity';
import { JwtAuthGuard } from 'src/auth/guards/jwt.auth.guard';

@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Controller('cooperative_member_approvals')
export class CooperativeMemberApprovalsController {
  constructor(
    private readonly cooperativeMemberApprovalsService: CooperativeMemberApprovalsService,
  ) {}

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
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  async create(
    @Body()
    createCooperativeMemberApprovalsDto: CreateCooperativeMemberApprovalsDto,
  ) {
    const response =
      await this.cooperativeMemberApprovalsService.createCooperativeMemberApprovals(
        createCooperativeMemberApprovalsDto,
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
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
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
  @ApiOperation({ summary: 'Get specific poll details' })
  @ApiParam({
    name: 'id',
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'Poll ID',
  })
  @ApiResponse({
    status: 200,
    description: 'Poll details',
    type: CooperativeMemberApprovals,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid ID format',
  })
  @ApiResponse({
    status: 404,
    description: 'Poll not found',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
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

  @Get('coop/:group_id')
  @ApiOperation({ summary: 'Get specific poll details for a group' })
  @ApiParam({
    name: 'id',
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'Group ID',
  })
  @ApiResponse({
    status: 200,
    description: 'Poll details',
    type: CooperativeMemberApprovals,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid ID format',
  })
  @ApiResponse({
    status: 404,
    description: 'Poll not found',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  async viewCooperativeMemberApprovalsByCoop(
    @Param('group_id') group_id: string,
    @Body() userJson: object,
  ) {
    const response =
      await this.cooperativeMemberApprovalsService.viewCooperativeMemberApprovalsByCoop(
        group_id,
        userJson,
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
  @ApiOperation({ summary: 'Update a poll' })
  @ApiParam({
    name: 'id',
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'Poll ID',
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
  })
  @ApiResponse({
    status: 404,
    description: 'Poll not found',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
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

  @Patch('/coop/:coop_id')
  @ApiOperation({ summary: 'Update a poll by coop_id' })
  @ApiParam({
    name: 'id',
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'Cooperative ID',
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
  })
  @ApiResponse({
    status: 404,
    description: 'Cooperative not found',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
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
    if (response) {
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

  /*
  @Patch('/coop/:coop_id/loans')
  @ApiOperation({ summary: 'Update a loan poll by coop_id' })
  @ApiParam({
    name: 'id',
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'Cooperative ID',
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
  })
  @ApiResponse({
    status: 404,
    description: 'Cooperative not found',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  async updateLoanByCoopID(
    @Param('coop_id') coop_id: string,
    @Body()
    updateCooperativeMemberApprovalsDto: UpdateCooperativeMemberApprovalsDto,
  ) {
    const response =
      await this.cooperativeMemberApprovalsService.updateCooperativeMemberApprovalsLoanByCoopID(
        coop_id,
        updateCooperativeMemberApprovalsDto,
      );
    if (response) {
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
  */

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a poll' })
  @ApiParam({
    name: 'id',
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'Poll ID',
  })
  @ApiResponse({
    status: 200,
    description: 'Confirmation of deletion',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid ID format',
  })
  @ApiResponse({
    status: 404,
    description: 'Poll not found',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
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
