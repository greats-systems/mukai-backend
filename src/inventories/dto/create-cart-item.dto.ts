// src/cart-item/dto/create-cart-item.dto.ts
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional, IsArray } from 'class-validator';

export class CreateCartItemDto {
    @ApiProperty({ description: 'Item name', example: 'Premium Coffee Beans' })
    @IsString()
    name: string;

    @ApiPropertyOptional({ description: 'Product name', example: 'Arabica Coffee' })
    @IsOptional()
    @IsString()
    product?: string;

    @ApiPropertyOptional({ description: 'Product category', example: 'Beverages' })
    @IsOptional()
    @IsString()
    category?: string;

    @ApiProperty({ description: 'Product ID', example: 'PROD-12345' })
    @IsString()
    productId: string;

    @ApiProperty({ description: 'Business ID', example: 'BUS-12345' })
    @IsString()
    businessId: string;

    @ApiPropertyOptional({ description: 'Cart item ID', example: 'CART-ITEM-123' })
    @IsOptional()
    @IsString()
    id?: string;

    @ApiPropertyOptional({ description: 'Order ID', example: 'ORDER-123' })
    @IsOptional()
    @IsString()
    orderId?: string;

    @ApiPropertyOptional({ description: 'Total price', example: 24.99 })
    @IsOptional()
    @IsNumber()
    totalPrice?: number;

    @ApiProperty({ description: 'Unit price', example: 12.99 })
    @IsNumber()
    price: number;

    @ApiProperty({ description: 'Quantity', example: 2 })
    @IsNumber()
    quantity: number;

    @ApiProperty({ description: 'Unit of measure', example: 'kg' })
    @IsString()
    unitOfMeasure: string;

    @ApiPropertyOptional({ description: 'Thumbnail image URL', example: 'https://example.com/thumbnail.jpg' })
    @IsOptional()
    @IsString()
    thumbnail?: string;

    @ApiPropertyOptional({ description: 'List of media IDs', example: ['IMG-1', 'IMG-2'], type: [String] })
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    mediaIds?: string[];

    @ApiPropertyOptional({ description: 'Creation date', example: '2023-01-01T00:00:00.000Z' })
    @IsOptional()
    @IsString()
    createdAt?: string;

    @ApiPropertyOptional({ description: 'Last update date', example: '2023-01-15T00:00:00.000Z' })
    @IsOptional()
    @IsString()
    updatedAt?: string;
}