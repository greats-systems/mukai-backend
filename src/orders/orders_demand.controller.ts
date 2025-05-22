// src/demand-order/demand-order.controller.ts
import { Controller, Get, Post, Body, Patch, Param, Delete, Put } from '@nestjs/common';

import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { DemandOrderResponseDto, UpdateDemandOrderDto } from './dto/update-order.dto';
import { CreateDemandOrderDto } from './dto/create-order.dto';
import { OrdersDemandService } from './orders-demand.service';

@ApiTags('order-demands')
@Controller('demand-orders')
export class DemandOrderController {
  constructor(private readonly demandOrderService: OrdersDemandService) { }

  @Post('create-order')
  @ApiOperation({ summary: 'Create a new demand order' })
  @ApiResponse({
    status: 201,
    description: 'The order has been successfully created.',
    type: DemandOrderResponseDto
  })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  create(@Body() createDemandOrderDto: CreateDemandOrderDto) {
    return this.demandOrderService.createOrderDemand(createDemandOrderDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all demand orders' })
  @ApiResponse({
    status: 200,
    description: 'List of all orders',
    type: [DemandOrderResponseDto]
  })
  findAll() {
    return this.demandOrderService.findAll();
  }

  @Get('get-order:id')
  @ApiOperation({ summary: 'Get a specific demand order by ID' })
  @ApiResponse({
    status: 200,
    description: 'The found order',
    type: DemandOrderResponseDto
  })
  @ApiResponse({ status: 404, description: 'Order not found.' })
  findOne(@Param('id') id: string) {
    return this.demandOrderService.findOne(id);
  }

  @Put('update-order/:id')
  @ApiOperation({ summary: 'Update a demand order' })
  @ApiResponse({
    status: 200,
    description: 'The order has been successfully updated.',
    type: DemandOrderResponseDto
  })
  @ApiResponse({ status: 404, description: 'Order not found.' })
  update(@Param('id') id: string, @Body() updateDemandOrderDto: UpdateDemandOrderDto) {
    return this.demandOrderService.update(id, updateDemandOrderDto);
  }

  @Delete('delete-order:id')
  @ApiOperation({ summary: 'Delete a demand order' })
  @ApiResponse({ status: 204, description: 'The order has been successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Order not found.' })
  remove(@Param('id') id: string) {
    return this.demandOrderService.remove(id);
  }
}