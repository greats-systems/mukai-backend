import { Controller, Get, Post, Body, Param, Patch, Delete, HttpException, HttpStatus } from '@nestjs/common';
import { AssetsService } from '../services/assets.service';
import { CreateAssetDto } from '../dto/create/create-asset.dto';
import { UpdateAssetDto } from '../dto/update/update-asset.dto';

@Controller('assets')
export class AssetsController {
  constructor(private readonly assetsService: AssetsService) {}

  @Post()
  async create(@Body() createAssetDto: CreateAssetDto) {
    const response = await this.assetsService.createAsset(createAssetDto);
    if (response['statusCode'] === 400) {
      throw new HttpException(response['message'], HttpStatus.BAD_REQUEST);
    }
    if (response['statusCode'] === 500) {
      throw new HttpException(response['message'], HttpStatus.INTERNAL_SERVER_ERROR);
    }
    return response;
  }

  @Get()
  async findAll() {
    const response = await this.assetsService.findAllAssets();
    if (response['statusCode'] === 400) {
      throw new HttpException(response['message'], HttpStatus.BAD_REQUEST);
    }
    if (response['statusCode'] === 500) {
      throw new HttpException(response['message'], HttpStatus.INTERNAL_SERVER_ERROR);
    }
    return response;
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const response = await this.assetsService.viewAsset(id);
    if (response['statusCode'] === 400) {
      throw new HttpException(response['message'], HttpStatus.BAD_REQUEST);
    }
    if (response['statusCode'] === 500) {
      throw new HttpException(response['message'], HttpStatus.INTERNAL_SERVER_ERROR);
    }
    return response;
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateAssetDto: UpdateAssetDto) {
    const response = await this.assetsService.updateAsset(id, updateAssetDto);
    if (response['statusCode'] === 400) {
      throw new HttpException(response['message'], HttpStatus.BAD_REQUEST);
    }
    if (response['statusCode'] === 500) {
      throw new HttpException(response['message'], HttpStatus.INTERNAL_SERVER_ERROR);
    }
    return response;
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    const response = await this.assetsService.deleteAsset(id);
    if (response['statusCode'] === 400) {
      throw new HttpException(response['message'], HttpStatus.BAD_REQUEST);
    }
    if (response['statusCode'] === 500) {
      throw new HttpException(response['message'], HttpStatus.INTERNAL_SERVER_ERROR);
    }
    return response;
  }
}
