import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { CreateDemandOrderDto, CreateOrderDto } from './create-order.dto';

// src/demand-order/dto/demand-order-response.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { ProfileResponseDto } from 'src/user/dto/create-user.dto';
import { InventoryResponseDto } from 'src/tradingservices/dto/update-inventory.dto';
import { IsString, IsNotEmpty, IsOptional, IsNumber } from 'class-validator';
import { CreateDemandRequestInventoryDto, CreateDemandRequestOfferDto } from 'src/tradingservices/dto/create/create-inventory.dto';


export class UpdateOrderDto extends PartialType(CreateOrderDto) { }
export class UpdateDemandOrderDto extends PartialType(CreateDemandOrderDto) {



    @IsString()
    id?: string;

    @ApiProperty({ description: 'Order category', example: 'retail' })
    @IsNotEmpty()
    @IsString()
    category: string;

    @ApiProperty({ description: 'ID of the sales person handling the order', example: '2884ed1c-9a32-46c9-bb9d-954f40abd69c' })
    @IsNotEmpty()
    @IsString()
    provider_id: string;

    @ApiProperty({ description: 'ID of the customer placing the order', example: '56619657-0c47-40ee-8711-aee9b8f98122' })
    @IsNotEmpty()
    @IsString()
    customer_id: string;

    @ApiProperty({
        description: 'Current status of the order',
        example: 'processing',
        enum: ['pending', 'processing', 'completed', 'cancelled']
    })
    @IsNotEmpty()
    @IsString()
    status: string;

    @ApiPropertyOptional({ description: 'Amount bid by client', example: 50.0, default: 0.0 })
    @IsOptional()
    @IsNumber()
    customer_price_offer?: number;

    @ApiPropertyOptional({ description: 'Amount bid by client', example: 50.0, default: 0.0 })
    @IsOptional()
    @IsNumber()
    provider_price_offer?: number;

    @ApiPropertyOptional({ description: 'Amount agreed by provider and final provider', example: 50.0, default: 0.0 })
    @IsOptional()
    @IsNumber()
    price_locked?: number;

    @ApiPropertyOptional({ description: 'Amount bid by providers', example: [50.0], default: [0.0] })
    @IsOptional()
    @IsNumber()
    market_prices?: [number];

    @ApiProperty({ type: () => CreateDemandRequestInventoryDto, description: 'Ordered item details' })
    item?: CreateDemandRequestInventoryDto;

    @ApiProperty({ type: () => CreateDemandRequestOfferDto, description: 'Ordered offer details' })
    offer?: CreateDemandRequestOfferDto;

    @ApiProperty({
        description: 'Payment method used',
        example: 'credit_card',
        enum: ['cash', 'credit_card', 'bank_transfer', 'mobile_payment']
    })

    @IsNotEmpty()
    @IsString()
    payment_method: string;
}
export class DemandOrderResponseDto {

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
