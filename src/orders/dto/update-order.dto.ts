import { PartialType } from '@nestjs/swagger';
import { CreateDemandOrderDto, CreateOrderDto } from './create-order.dto';

// src/demand-order/dto/demand-order-response.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { ProfileResponseDto } from 'src/user/dto/create-user.dto';
import { InventoryResponseDto } from 'src/inventories/dto/update-inventory.dto';


export class UpdateOrderDto extends PartialType(CreateOrderDto) { }

export class DemandOrderResponseDto {
    @ApiProperty({ description: 'Auto-incremented primary key', example: 1 })
    collectionId: number;

    @ApiProperty({ description: 'Order category', example: 'retail' })
    category: string;

    @ApiProperty({ description: 'Unique order identifier', example: 'ORD-12345' })
    id: string;

    @ApiProperty({ description: 'ID of the sales person handling the order', example: 'SP-001' })
    salesPersonId: string;

    @ApiProperty({ description: 'ID of the customer placing the order', example: 'CUST-001' })
    customerId: string;

    @ApiProperty({ type: () => ProfileResponseDto, description: 'Customer profile details' })
    customer?: ProfileResponseDto;

    @ApiProperty({ type: () => InventoryResponseDto, description: 'Ordered item details' })
    item: InventoryResponseDto;

    @ApiProperty({
        description: 'Current status of the order',
        example: 'processing',
        enum: ['pending', 'processing', 'completed', 'cancelled']
    })
    orderStatus: string;

    @ApiProperty({ description: 'Amount already paid', example: 50.0, default: 0.0 })
    amountPaid: number;

    @ApiProperty({ description: 'Cash tendered by customer', example: 100.0, default: 0.0 })
    tenderedCash: number;

    @ApiProperty({
        description: 'Payment method used',
        example: 'credit_card',
        enum: ['cash', 'credit_card', 'bank_transfer', 'mobile_payment']
    })
    paymentMethod: string;

    @ApiProperty({
        description: 'Payment status',
        example: 'partial',
        enum: ['pending', 'partial', 'full', 'refunded']
    })
    paymentStatus: string;

    @ApiProperty({ description: 'Total order amount', example: 150.0, default: 0.0 })
    totalOrderAmount: number;

    @ApiProperty({ description: 'Order creation timestamp', example: '2023-01-01T00:00:00.000Z' })
    createdAt: Date;

    @ApiProperty({ description: 'Order last update timestamp', example: '2023-01-01T00:00:00.000Z' })
    updatedAt: Date;
}
export class UpdateDemandOrderDto extends PartialType(CreateDemandOrderDto) { }