/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import {
  UseGuards,
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
  Get,
  Req,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiBody,
  ApiResponse,
  ApiExcludeEndpoint,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt.auth.guard';
import { CreateSystemLogDto } from '../dto/create/create-system-logs.dto';
import { SystemLogsService } from '../services/system-logs.service';
import { SystemLog } from '../entities/system-logs.entity';

@ApiTags('System Logs')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
// @ApiExcludeController()
@Controller('system-logs')
export class SystemLogsController {
  constructor(private readonly slService: SystemLogsService) {}
  @ApiExcludeEndpoint()
  @Post()
  @ApiOperation({ summary: 'Create system log' })
  @ApiBody({ type: CreateSystemLogDto })
  @ApiResponse({
    status: 201,
    description: 'System log created successfully',
    type: SystemLog,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  async create(@Body() createSystemLogsDto: CreateSystemLogDto) {
    const response = await this.slService.createSystemLogs(createSystemLogsDto);
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
  @ApiOperation({ summary: 'List all system logs' })
  @ApiResponse({
    status: 200,
    description: 'Array of system logs',
    type: [SystemLog],
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid request',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  async findAll(@Req() req) {
    const response = await this.slService.findAllSystemLogs(req.user.sub);
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
