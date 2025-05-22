// src/cart-item/entities/cart-item.entity.ts
import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Order } from 'src/orders/entities/order.entity';

@Entity()
export class CartItem {
    @ApiProperty({ description: 'Auto-generated collection ID', example: 123456789 })
    @PrimaryColumn()
    collectionId: number;

    @ApiProperty({ description: 'Item name', example: 'Premium Coffee Beans' })
    @Column({ nullable: true })
    name: string;

    @ApiProperty({ description: 'Product name', example: 'Arabica Coffee', required: false })
    @Column({ nullable: true })
    product: string;

    @ApiProperty({ description: 'Product category', example: 'Beverages', required: false })
    @Column({ nullable: true })
    category: string;

    @ApiProperty({ description: 'Product ID', example: 'PROD-12345' })
    @Column({ name: 'product_id', nullable: true })
    productId: string;

    @ApiProperty({ description: 'Business ID', example: 'BUS-12345' })
    @Column({ name: 'business_id', nullable: true })
    businessId: string;

    @ApiProperty({ description: 'Cart item ID', example: 'CART-ITEM-123' })
    @Column({ nullable: true })
    id: string;

    @ApiProperty({ description: 'Order ID', example: 'ORDER-123' })
    @Column({ name: 'order_id', nullable: true })
    orderId: string;

    @ApiProperty({ description: 'Total price', example: 24.99 })
    @Column({ name: 'total_price', type: 'float', nullable: true })
    totalPrice: number;

    @ApiProperty({ description: 'Unit price', example: 12.99 })
    @Column({ type: 'float', nullable: true })
    price: number;

    @ApiProperty({ description: 'Quantity', example: 2 })
    @Column({ type: 'float', nullable: true })
    quantity: number;

    @ApiProperty({ description: 'Unit of measure', example: 'kg' })
    @Column({ name: 'unit_of_measure', nullable: true })
    unitOfMeasure: string;

    @ApiProperty({ description: 'Thumbnail image URL', example: 'https://example.com/thumbnail.jpg', required: false })
    @Column({ nullable: true })
    thumbnail: string;

    @ApiProperty({ description: 'List of media IDs', example: ['IMG-1', 'IMG-2'], type: [String], required: false })
    @Column('simple-array', { name: 'media_ids', nullable: true })
    mediaIds: string[];

    @ApiProperty({ description: 'Creation date', example: '2023-01-01T00:00:00.000Z', required: false })
    @Column({ name: 'created_at', nullable: true })
    createdAt: string;

    @ApiProperty({ description: 'Last update date', example: '2023-01-15T00:00:00.000Z', required: false })
    @Column({ name: 'updated_at', nullable: true })
    updatedAt: string;

    @ManyToOne(() => Order, (saleOrder) => saleOrder.cartItems)
    @JoinColumn({ name: 'order_id', referencedColumnName: 'id' })
    salesOrder: Order;
}