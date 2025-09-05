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
import { CooperativesService } from '../services/cooperatives.service';
import { CreateCooperativeDto } from '../dto/create/create-cooperative.dto';
import { UpdateCooperativeDto } from '../dto/update/update-cooperative.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { Cooperative } from '../entities/cooperative.entity';
import { Profile } from 'src/user/entities/user.entity';
import { JwtAuthGuard } from 'src/auth/guards/jwt.auth.guard';

@ApiTags('Cooperatives')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Controller('cooperatives')
export class CooperativesController {
  constructor(private readonly cooperativesService: CooperativesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new cooperative' })
  @ApiBody({ type: CreateCooperativeDto })
  @ApiResponse({
    status: 201,
    description: 'Cooperative created successfully',
    type: Cooperative,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  async create(@Body() createCooperativeDto: CreateCooperativeDto) {
    const response =
      await this.cooperativesService.createCooperative(createCooperativeDto);
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
  @ApiOperation({ summary: 'List all cooperatives' })
  @ApiResponse({
    status: 200,
    description: 'Array of cooperatives',
    type: [Cooperative],
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
    const response = await this.cooperativesService.findAllCooperatives();
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

  @Get('initialize-data/:member_id')
  @ApiOperation({ summary: 'eturn groups for a given member' })
  @ApiResponse({
    status: 200,
    description: 'Array of cooperatives',
    type: [Cooperative],
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid request',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  async initializeMembers(@Param('member_id') member_id: string) {
    const response =
      await this.cooperativesService.initializeMembers(member_id);
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

  @Get('members/available')
  @ApiOperation({ summary: 'List all members that do not have a cooperative' })
  @ApiResponse({
    status: 200,
    description: 'Array of profiles',
    type: [Profile],
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid request',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  async viewAvailableMembers() {
    const response = await this.cooperativesService.viewAvailableMembers();
    // console.log(`viewAvailableMembers response: ${JSON.stringify(response)}`);
    // if (response['statusCode'] === 400) {
    //   throw new HttpException(response['message'], HttpStatus.BAD_REQUEST);
    // }
    // if (response['statusCode'] === 500) {
    //   throw new HttpException(
    //     response['message'],
    //     HttpStatus.INTERNAL_SERVER_ERROR,
    //   );
    // }
    return response;
  }

  @Get('admin/:admin_id')
  @ApiOperation({ summary: 'List all cooperatives for a specific admin' })
  @ApiResponse({
    status: 200,
    description: 'Array of cooperatives',
    type: [Cooperative],
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid request',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  async viewCooperativesForAdmin(@Param('admin_id') admin_id: string) {
    const response =
      await this.cooperativesService.viewCooperativesForAdmin(admin_id);
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
  @ApiOperation({ summary: 'Get members for a specific cooperative' })
  @ApiParam({
    name: 'cooperative_id',
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'Cooperative ID',
  })
  @ApiResponse({
    status: 200,
    description: 'Array of member cooperatives',
    type: [Profile],
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid cooperative ID',
  })
  @ApiResponse({
    status: 404,
    description: 'Cooperative not found',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  async viewCooperativeMembers(
    @Param('cooperative_id') cooperative_id: string,
  ) {
    const response =
      await this.cooperativesService.viewCooperativeMembers(cooperative_id);
    console.log(response);
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
    }
    return response;
  }

  @Get(':member_id/active')
  @ApiOperation({ summary: 'Get cooperatives for a specific member' })
  @ApiParam({
    name: 'member_id',
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'Member ID',
  })
  @ApiResponse({
    status: 200,
    description: 'Array of member cooperatives',
    type: [Cooperative],
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
  async viewCooperativesForMember(@Param('member_id') member_id: string) {
    const response =
      await this.cooperativesService.viewCooperativesForMember(member_id);
    if (response['statusCode'] === 400) {
      throw new HttpException(
        response['message'] ?? 'Bad request',
        HttpStatus.BAD_REQUEST,
      );
    }
    if (response['statusCode'] === 500) {
      throw new HttpException(
        response['message'] ?? 'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    return response;
  }

  @Get(':cooperative_id/subs')
  @ApiOperation({ summary: 'Check member subscriptions for a cooperative' })
  @ApiParam({
    name: 'cooperative_id',
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'Cooperative ID',
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

    const response = await this.cooperativesService.checkMemberSubscriptions(
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

  @Get(':id')
  @ApiOperation({ summary: 'Get cooperative details' })
  @ApiParam({
    name: 'id',
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'Cooperative ID',
  })
  @ApiResponse({
    status: 200,
    description: 'Cooperative details',
    type: Cooperative,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid ID format',
  })
  @ApiResponse({
    status: 404,
    description: 'Cooperative not found',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  async findOne(@Param('id') id: string) {
    const response = await this.cooperativesService.viewCooperative(id);
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
  @ApiOperation({ summary: 'Update a cooperative' })
  @ApiParam({
    name: 'id',
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'Cooperative ID',
  })
  @ApiBody({ type: UpdateCooperativeDto })
  @ApiResponse({
    status: 200,
    description: 'Updated cooperative details',
    type: Cooperative,
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
  async update(
    @Param('id') id: string,
    @Body() updateCooperativeDto: UpdateCooperativeDto,
  ) {
    const response = await this.cooperativesService.updateCooperative(
      id,
      updateCooperativeDto,
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
  @ApiOperation({ summary: 'Delete a cooperative' })
  @ApiParam({
    name: 'id',
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'Cooperative ID',
  })
  @ApiResponse({
    status: 200,
    description: 'Updated cooperative details',
    type: Cooperative,
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
  async delete(@Param('id') id: string) {
    const response = await this.cooperativesService.deleteCooperative(id);
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
