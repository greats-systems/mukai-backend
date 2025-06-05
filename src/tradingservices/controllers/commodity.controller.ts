// commodity.controller.ts
import { Controller, Get, Post, Body, Param, HttpStatus } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
} from '@nestjs/swagger';
import { CommodityService } from '../services/commodity.service';
import { CreateCommodityDto } from '../dto/create/create-commodity.dto';
import { Commodity } from '../entities/commodity.entity';

@ApiTags('Commodities')
@Controller('commodities')
export class CommodityController {
  constructor(private readonly commodityService: CommodityService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new commodity' })
  @ApiBody({ type: CreateCommodityDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Commodity created successfully',
    type: Commodity,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Server error',
  })
  async create(
    @Body() createCommodityDto: CreateCommodityDto,
  ): Promise<Commodity> {
    return this.commodityService.createCommodity(createCommodityDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all commodities' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of all commodities',
    type: [Commodity],
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Server error',
  })
  async findAll(): Promise<Commodity[]> {
    return this.commodityService.findAllCommodities();
  }

  @Get(':commodity_id')
  @ApiOperation({ summary: 'Get a specific commodity' })
  @ApiParam({
    name: 'commodity_id',
    type: String,
    description: 'Commodity ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Commodity details',
    type: Commodity,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Commodity not found',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Server error',
  })
  async findOne(
    @Param('commodity_id') commodity_id: string,
  ): Promise<Commodity> {
    return this.commodityService.findCommodityById(commodity_id);
  }
}
