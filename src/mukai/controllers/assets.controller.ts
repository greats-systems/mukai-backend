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
import { AssetsService } from '../services/assets.service';
import { CreateAssetDto } from '../dto/create/create-asset.dto';
import { UpdateAssetDto } from '../dto/update/update-asset.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { Asset } from '../entities/asset.entity';
import { JwtAuthGuard } from 'src/auth/guards/jwt.auth.guard';

@ApiTags('Assets')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Controller('assets')
export class AssetsController {
  constructor(private readonly assetsService: AssetsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new asset' })
  @ApiBody({ type: CreateAssetDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Asset created successfully',
    type: Asset,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Server error',
  })
  async create(@Body() createAssetDto: CreateAssetDto) {
    const response = await this.assetsService.createAsset(createAssetDto);
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

  @Post('individual')
  @ApiOperation({ summary: 'Create a new individual asset' })
  @ApiBody({ type: CreateAssetDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Asset created successfully',
    type: Asset,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Server error',
  })
  async createIndividual(@Body() createAssetDto: CreateAssetDto) {
    const response = await this.assetsService.createIndividualAsset(createAssetDto);
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
  

  @Get()
  @ApiOperation({ summary: 'Get all assets' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of all assets',
    type: [Asset],
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid request',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Server error',
  })
  async findAll() {
    const response = await this.assetsService.findAllAssets();
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

  @Get('group/:id')
  @ApiOperation({ summary: 'Get all assets for a group' })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'Group ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of assets for the group',
    type: [Asset],
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid request',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Server error',
  })
  async getGroupAssets(@Param('id') id: string) {
    const response = await this.assetsService.getGroupAssets(id);
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

  @Get('profile/:id')
  @ApiOperation({ summary: 'Get all assets for a profile' })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'Profile ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of assets for the profile',
    type: [Asset],
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid request',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Server error',
  })
  async getProfileAssets(@Param('id') id: string) {
    const response = await this.assetsService.getProfileAssets(id);
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

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific asset' })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'Asset ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Asset details',
    type: Asset,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid request',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Server error',
  })
  async findOne(@Param('id') id: string) {
    const response = await this.assetsService.viewAsset(id);
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
  @ApiOperation({ summary: 'Update an asset' })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'Asset ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiBody({ type: UpdateAssetDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Asset updated successfully',
    type: Asset,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Server error',
  })
  async update(
    @Param('id') id: string,
    @Body() updateAssetDto: UpdateAssetDto,
  ) {
    const response = await this.assetsService.updateAsset(id, updateAssetDto);
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

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an asset' })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'Asset ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Asset deleted successfully',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid request',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Server error',
  })
  async delete(@Param('id') id: string) {
    const response = await this.assetsService.deleteAsset(id);
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
}
