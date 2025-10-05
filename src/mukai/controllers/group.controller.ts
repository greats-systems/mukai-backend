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
import { CreateGroupDto } from '../dto/create/create-group.dto';
import { UpdateGroupDto } from '../dto/update/update-group.dto';
import { GroupService } from '../services/group.service';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
  ApiBearerAuth,
  ApiExcludeController,
} from '@nestjs/swagger';
import { Group } from '../entities/group.entity';
import { JwtAuthGuard } from 'src/auth/guards/jwt.auth.guard';

@ApiTags('Groups')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@ApiExcludeController()
@Controller('groups')
export class GroupsController {
  constructor(private readonly groupsService: GroupService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new group' })
  @ApiBody({ type: CreateGroupDto })
  @ApiResponse({
    status: 201,
    description: 'Group created successfully',
    type: Group,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  async create(@Body() createGroupDto: CreateGroupDto) {
    const response = await this.groupsService.createGroup(createGroupDto);
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
  @ApiOperation({ summary: 'List all groups' })
  @ApiResponse({
    status: 200,
    description: 'Array of groups',
    type: [Group],
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
    const response = await this.groupsService.findAllGroups();
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

  @Get(':member_id/groups')
  @ApiOperation({ summary: 'Get groups for a specific member' })
  @ApiParam({
    name: 'member_id',
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'Member ID',
  })
  @ApiResponse({
    status: 200,
    description: 'Array of member groups',
    type: [Group],
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid member ID',
  })
  @ApiResponse({
    status: 404,
    description: 'Member not found',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  async viewGroupsForMember(@Param('member_id') member_id: string) {
    const response = await this.groupsService.viewGroupsForMember(member_id);
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

  @Get('subs/:group_id')
  @ApiOperation({ summary: 'Check member subscriptions for a group' })
  @ApiParam({
    name: 'group_id',
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'Group ID',
  })
  @ApiBody({
    description: 'Optional month filter',
    schema: {
      type: 'object',
      properties: {
        month: {
          type: 'string',
          example: 'January',
          description: 'Month name (defaults to current month)',
        },
        year: {
          type: 'number',
          example: 2023,
          description: 'Year (defaults to current year)',
        },
      },
    },
    required: false,
  })
  @ApiResponse({
    status: 200,
    description: 'Subscription status',
    schema: {
      type: 'object',
      properties: {
        paid: { type: 'boolean' },
        month: { type: 'string' },
        year: { type: 'number' },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid group ID or month format',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  async checkMemberSubscriptions(
    @Param('group_id') group_id: string,
    @Body() period?: { month?: string; year?: number },
  ) {
    const month =
      period?.month || new Date().toLocaleString('default', { month: 'long' });
    const year = period?.year || new Date().getFullYear();

    const response = await this.groupsService.checkMemberSubscriptions(
      group_id,
      month,
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
    return { paid: response, month, year };
  }

  @Get(':group_id/wallet')
  @ApiOperation({ summary: 'Get wallet details for a group' })
  @ApiParam({
    name: 'group_id',
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'Group ID',
  })
  @ApiResponse({
    status: 200,
    description: 'Group wallet details',
    type: Object, // Replace with your Wallet type
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid group ID',
  })
  @ApiResponse({
    status: 404,
    description: 'Group wallet not found',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  async viewGroupWallet(@Param('group_id') group_id: string) {
    const response = await this.groupsService.viewGroupWallet(group_id);
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
  @ApiOperation({ summary: 'Get group details' })
  @ApiParam({
    name: 'id',
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'Group ID',
  })
  @ApiResponse({
    status: 200,
    description: 'Group details',
    type: Group,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid ID format',
  })
  @ApiResponse({
    status: 404,
    description: 'Group not found',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  async findOne(@Param('id') id: string) {
    const response = await this.groupsService.viewGroup(id);
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
  @ApiOperation({ summary: 'Update a group' })
  @ApiParam({
    name: 'id',
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'Group ID',
  })
  @ApiBody({ type: UpdateGroupDto })
  @ApiResponse({
    status: 200,
    description: 'Updated group details',
    type: Group,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data',
  })
  @ApiResponse({
    status: 404,
    description: 'Group not found',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  async update(
    @Param('id') id: string,
    @Body() updateGroupDto: UpdateGroupDto,
  ) {
    const response = await this.groupsService.updateGroup(id, updateGroupDto);
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
  @ApiOperation({ summary: 'Delete a group' })
  @ApiParam({
    name: 'id',
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'Group ID',
  })
  @ApiResponse({
    status: 200,
    description: 'Group deleted successfully',
    type: Group,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data',
  })
  @ApiResponse({
    status: 404,
    description: 'Group not found',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  async delete(@Param('id') id: string) {
    const response = await this.groupsService.deleteGroup(id);
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
