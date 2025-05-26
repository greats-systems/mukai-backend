// src/demand-order/dto/create-demand-order.dto.ts
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { CreateDemandRequestInventoryDto } from 'src/tradingservices/dto/create/create-inventory.dto';
import { InventoryResponseDto } from 'src/tradingservices/dto/update-inventory.dto';
export class CreateOrderDto { }

export class CreateDemandOrderDto {
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

    @ApiPropertyOptional({ description: 'Amount agreed by customer and final provider', example: 50.0, default: 0.0 })
    @IsOptional()
    @IsNumber()
    price_locked?: number;

    @ApiPropertyOptional({ description: 'Amount bid by providers', example: [50.0], default: [0.0] })
    @IsOptional()
    @IsNumber()
    market_prices?: [number];

    @ApiProperty({ type: () => CreateDemandRequestInventoryDto, description: 'Ordered item details' })
    item?: CreateDemandRequestInventoryDto;

    @ApiProperty({
        description: 'Payment method used',
        example: 'credit_card',
        enum: ['cash', 'credit_card', 'bank_transfer', 'mobile_payment']
    })

    @IsNotEmpty()
    @IsString()
    payment_method: string;
}