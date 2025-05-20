// src/cart-item/cart-item.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CreateCartItemDto } from './dto/create-cart-item.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CartItemResponseDto } from './dto/cart-item-response.dto';
import { CartItemService } from './cartitems.service';
import { CartItem } from './entities/cart-item.entity';

@ApiTags('cart-items')
@Controller('cart-items')
export class CartItemController {
  constructor(private readonly cartItemService: CartItemService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new cart item' })
  @ApiResponse({
    status: 201,
    description: 'The cart item has been successfully created.',
    type: CartItemResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  create(@Body() createCartItemDto: CreateCartItemDto) {
    return this.cartItemService.create(createCartItemDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all cart items' })
  @ApiResponse({
    status: 200,
    description: 'List of all cart items',
    type: [CartItemResponseDto],
  })
  findAll() {
    return this.cartItemService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific cart item by ID' })
  @ApiResponse({
    status: 200,
    description: 'The found cart item',
    type: CartItemResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Cart item not found.' })
  findOne(@Param('id') id: string) {
    return this.cartItemService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a cart item' })
  @ApiResponse({
    status: 200,
    description: 'The cart item has been successfully updated.',
    type: CartItemResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Cart item not found.' })
  update(@Param('id') id: string, @Body() updateCartItemDto: CartItem) {
    return this.cartItemService.update(id, updateCartItemDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a cart item' })
  @ApiResponse({
    status: 204,
    description: 'The cart item has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'Cart item not found.' })
  remove(@Param('id') id: string) {
    return this.cartItemService.remove(id);
  }
}
