// src/cart-item/dto/cart-item-response.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { Order } from 'src/orders/entities/order.entity';

export class CartItemResponseDto {
    @ApiProperty({ description: 'Auto-generated collection ID', example: 123456789 })
    collectionId: number;

    @ApiProperty({ description: 'Item name', example: 'Premium Coffee Beans' })
    name: string;

    @ApiProperty({ description: 'Product name', example: 'Arabica Coffee', required: false })
    product: string;

    @ApiProperty({ description: 'Product category', example: 'Beverages', required: false })
    category: string;

    @ApiProperty({ description: 'Product ID', example: 'PROD-12345' })
    productId: string;

    @ApiProperty({ description: 'Business ID', example: 'BUS-12345' })
    businessId: string;

    @ApiProperty({ description: 'Cart item ID', example: 'CART-ITEM-123' })
    id: string;

    @ApiProperty({ description: 'Order ID', example: 'ORDER-123' })
    orderId: string;

    @ApiProperty({ description: 'Total price', example: 24.99 })
    totalPrice: number;

    @ApiProperty({ description: 'Unit price', example: 12.99 })
    price: number;

    @ApiProperty({ description: 'Quantity', example: 2 })
    quantity: number;

    @ApiProperty({ description: 'Unit of measure', example: 'kg' })
    unitOfMeasure: string;

    @ApiProperty({ description: 'Thumbnail image URL', example: 'https://example.com/thumbnail.jpg', required: false })
    thumbnail: string;

    @ApiProperty({ description: 'List of media IDs', example: ['IMG-1', 'IMG-2'], type: [String], required: false })
    mediaIds: string[];

    @ApiProperty({ description: 'Creation date', example: '2023-01-01T00:00:00.000Z', required: false })
    createdAt: string;

    @ApiProperty({ description: 'Last update date', example: '2023-01-15T00:00:00.000Z', required: false })
    updatedAt: string;

    @ApiProperty({ type: () => Order, required: false })
    salesOrder: Order;
}