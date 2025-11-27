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
import { ErrorResponseDto } from 'src/common/dto/error-response.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt.auth.guard';
import { MunicipalitiesService } from '../services/pay-municipality.service';

@ApiTags('Municipalities')
// @UseGuards(JwtAuthGuard)
// @ApiBearerAuth()
@Controller('municipality')
export class MunicipalitiesController {
  constructor(private readonly municipalityService: MunicipalitiesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new municipality' })
  @ApiBody({ type: Object })
  @ApiResponse({
    status: 201,
    description: 'Municipalities created successfully',
    type: Object,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  async create(@Body() createMunicipalitiesDto: object) {
    const response = await this.municipalityService.createMunicipality(
      createMunicipalitiesDto,
    );
    if (response instanceof ErrorResponseDto) {
      if (response.statusCode === 400) {
        throw new HttpException(
          response.message ?? 'Bad Request',
          HttpStatus.BAD_REQUEST,
        );
      }
      if (response.statusCode === 500) {
        throw new HttpException(
          response.message ?? 'Internal Server Error',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
    return response;
  }

  @Get()
  @ApiOperation({ summary: 'List all loans' })
  @ApiResponse({
    status: 200,
    description: 'Array of loans',
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
    const response = await this.municipalityService.findAllMunicipalities();
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
  @ApiOperation({ summary: 'Get municipality details' })
  @ApiParam({
    name: 'id',
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'Municipalities ID',
  })
  @ApiResponse({
    status: 200,
    description: 'Municipalities details',
    type: Object,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid ID format',
  })
  @ApiResponse({
    status: 404,
    description: 'Municipalities not found',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  async findOne(@Param('id') id: string) {
    const response = await this.municipalityService.viewMunicipality(id);
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

  @Get('name/:name')
  @ApiOperation({ summary: 'Get municipality details by name' })
  @ApiParam({
    name: 'name',
    example: 'Harare',
    description: 'Municipality name',
  })
  @ApiResponse({
    status: 200,
    description: 'Municipalities details',
    type: Object,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid ID format',
  })
  @ApiResponse({
    status: 404,
    description: 'Municipalities not found',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  async viewMunicipalityByName(@Param('name') name: string) {
    const response =
      await this.municipalityService.viewMunicipalityByName(name);
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
  @ApiOperation({ summary: 'Update municipality' })
  @ApiParam({
    name: 'id',
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'Municipalities ID',
  })
  @ApiBody({ type: Object })
  @ApiResponse({
    status: 200,
    description: 'Updated municipality details',
    type: Object,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data',
  })
  @ApiResponse({
    status: 404,
    description: 'Municipalities not found',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  async update(
    @Param('id') id: string,
    @Body() updateMunicipalitiesDto: object,
  ) {
    const response = await this.municipalityService.updateMunicipality(
      id,
      updateMunicipalitiesDto,
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
  @ApiOperation({ summary: 'Delete municipality' })
  @ApiParam({
    name: 'id',
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'Municipalities ID',
  })
  @ApiResponse({
    status: 200,
    description: 'Municipalities deleted successfully',
    type: Object,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data',
  })
  @ApiResponse({
    status: 404,
    description: 'Municipalities not found',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  async delete(@Param('id') id: string) {
    const response = await this.municipalityService.deleteMunicipality(id);
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
