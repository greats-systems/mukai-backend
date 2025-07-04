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
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { GroupMemberService } from '../services/group-members.service';
import { CreateGroupMemberDto } from '../dto/create/create-group-members.dto';
import { GroupMembers } from '../entities/group-members.entity';
import { UpdateGroupMemberDto } from '../dto/update/update-group-members.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt.auth.guard';
// import { Cooperative } from '../entities/cooperative.entity';

@ApiTags('GroupMembers')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Controller('group_members')
export class GroupMemberController {
  constructor(private readonly groupMemberService: GroupMemberService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new group_member' })
  @ApiBody({ type: CreateGroupMemberDto })
  @ApiResponse({
    status: 201,
    description: 'GroupMember created successfully',
    type: GroupMembers,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  async create(@Body() createGroupMemberDto: CreateGroupMemberDto) {
    const response =
      await this.groupMemberService.createGroupMember(createGroupMemberDto);
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
  @ApiOperation({ summary: 'List all group_members' })
  @ApiResponse({
    status: 200,
    description: 'Array of group_members',
    type: [GroupMembers],
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
    const response = await this.groupMemberService.findAllGroupMembers();
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

  @Get(':member_id/coops')
  @ApiOperation({ summary: 'List all coops for member' })
  @ApiResponse({
    status: 200,
    description: 'Array of coops',
    type: [GroupMembers],
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid request',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  async findGroupsContainingMember(member_id: string) {
    const response =
      await this.groupMemberService.findGroupsContainingMember(member_id);
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

  @Get(':cooperative_id/members')
  @ApiOperation({ summary: 'List all members for coop' })
  @ApiResponse({
    status: 200,
    description: 'Array of members',
    type: [GroupMembers],
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid request',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  async findMembersInGroup(@Param('cooperative_id') cooperative_id: string) {
    const response =
      await this.groupMemberService.findMembersInGroup(cooperative_id);
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
  @ApiOperation({ summary: 'Get group_member details' })
  @ApiParam({
    name: 'id',
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'GroupMember ID',
  })
  @ApiResponse({
    status: 200,
    description: 'GroupMember details',
    type: GroupMembers,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid ID format',
  })
  @ApiResponse({
    status: 404,
    description: 'GroupMember not found',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  async findOne(@Param('id') id: string) {
    const response = await this.groupMemberService.viewGroupMember(id);
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
  @ApiOperation({ summary: 'Update a group_member' })
  @ApiParam({
    name: 'id',
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'GroupMember ID',
  })
  @ApiBody({ type: UpdateGroupMemberDto })
  @ApiResponse({
    status: 200,
    description: 'Updated group_member details',
    type: GroupMembers,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data',
  })
  @ApiResponse({
    status: 404,
    description: 'GroupMember not found',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  async update(
    @Param('id') id: string,
    @Body() updateGroupMemberDto: UpdateGroupMemberDto,
  ) {
    const response = await this.groupMemberService.updateGroupMember(
      id,
      updateGroupMemberDto,
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
  @ApiOperation({ summary: 'Delete an group_member' })
  @ApiParam({
    name: 'id',
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'GroupMember ID',
  })
  @ApiResponse({
    status: 200,
    description: 'GroupMember deleted successfully',
    type: GroupMembers,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data',
  })
  @ApiResponse({
    status: 404,
    description: 'GroupMember not found',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  async delete(@Param('id') id: string) {
    const response = await this.groupMemberService.deleteGroupMember(id);
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
