// src/demand-order/entities/demand-order.entity.ts
import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Profile } from 'src/user/entities/user.entity';
import { Inventory } from 'src/tradingservices/entities/inventory.entity';
import { CartItem } from 'src/tradingservices/entities/cart-item.entity';
import { Business } from 'src/organizations/entities/organization.entity';

@Entity()
export class Order {
    @ApiProperty({ description: 'Auto-incremented primary key', example: 1 })
    @PrimaryGeneratedColumn()
    collectionId: number;

    @ApiProperty({ description: 'Order category', example: 'retail' })
    @Column()
    category: string;

    @ApiProperty({ description: 'Unique order identifier', example: 'ORD-12345' })
    @Column()
    id: string;

    @ApiProperty({ description: 'ID of the sales person handling the order', example: 'SP-001' })
    @Column({ name: 'sales_person_id' })
    salesPersonId: string;

    @ApiProperty({ description: 'ID of the customer placing the order', example: 'CUST-001' })
    @Column({ name: 'customer_id' })
    customerId: string;
    @ApiProperty({ type: () => Profile, description: 'Customer profile details' })
    @ManyToOne(() => Profile, { eager: true })
    @JoinColumn({ name: 'customer_id', referencedColumnName: 'id' })
    customer: Profile;

    @ApiProperty({ type: () => Business, description: 'Business profile details' })
    @ManyToOne(() => Business, { eager: true })
    @JoinColumn({ name: 'customer_id', referencedColumnName: 'id' })
    provider: Business;

    @ApiProperty({ type: () => Inventory, description: 'Ordered item details' })
    @ManyToOne(() => Inventory, { eager: true })
    @JoinColumn()
    item: Inventory;

    @ApiProperty({ type: () => Inventory, description: 'Ordered item details' })
    @ManyToOne(() => Inventory, { eager: true })
    @JoinColumn()
    cartItems: [Inventory];


    @ApiProperty({
        description: 'Current status of the order',
        example: 'processing',
        enum: ['pending', 'processing', 'completed', 'cancelled']
    })
    @Column({ name: 'order_status' })
    orderStatus: string;

    @ApiProperty({ description: 'Amount already paid', example: 50.0, default: 0.0 })
    @Column({ name: 'amount_paid', type: 'float', default: 0.0 })
    amountPaid: number;

    @ApiProperty({ description: 'Cash tendered by customer', example: 100.0, default: 0.0 })
    @Column({ name: 'tendered_cash', type: 'float', default: 0.0 })
    tenderedCash: number;

    @ApiProperty({
        description: 'Payment method used',
        example: 'credit_card',
        enum: ['cash', 'credit_card', 'bank_transfer', 'mobile_payment']
    })
    @Column({ name: 'payment_method' })
    paymentMethod: string;

    @ApiProperty({
        description: 'Payment status',
        example: 'partial',
        enum: ['pending', 'partial', 'full', 'refunded']
    })
    @Column({ name: 'payment_status' })
    paymentStatus: string;

    @ApiProperty({ description: 'Total order amount', example: 150.0, default: 0.0 })
    @Column({ name: 'total_order_amount', type: 'float', default: 0.0 })
    totalOrderAmount: number;

    @ApiProperty({ description: 'Order creation timestamp', example: '2023-01-01T00:00:00.000Z' })
    @Column({ name: 'created_at' })
    createdAt: Date;

    @ApiProperty({ description: 'Order last update timestamp', example: '2023-01-01T00:00:00.000Z' })
    @Column({ name: 'updated_at' })
    updatedAt: Date;
}