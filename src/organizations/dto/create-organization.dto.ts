export class CreateOrganizationDto { }
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
    IsString, IsNumber, IsOptional, IsNotEmpty, IsArray
} from 'class-validator';
import { CartItemResponseDto } from 'src/inventories/dto/cart-item-response.dto';
import { InventoryResponseDto } from 'src/inventories/dto/update-inventory.dto';
import { ProfileResponseDto } from 'src/user/dto/create-user.dto';

export class CreateBusinessDto {
    @ApiPropertyOptional({ description: 'Business ID', example: 'BUS-12345' })
    @IsOptional()
    @IsString()
    id?: string;

    @ApiPropertyOptional({ description: 'Entrepreneur ID', example: 'ENT-123' })
    @IsOptional()
    @IsString()
    entreprenuerId?: string;

    @ApiProperty({ description: 'Business trading name', example: 'Premium Roasters Inc.' })
    @IsNotEmpty()
    @IsString()
    trading_name: string;

    @ApiPropertyOptional({ description: 'Admin role', example: 'owner' })
    @IsOptional()
    @IsString()
    admin_role?: string;

    @ApiPropertyOptional({ description: 'Business logo URL', example: 'https://example.com/logo.png' })
    @IsOptional()
    @IsString()
    logo?: string;

    @ApiPropertyOptional({ description: 'Logo ID', example: 'LOGO-123' })
    @IsOptional()
    @IsString()
    logo_id?: string;

    @ApiPropertyOptional({ description: 'Business banner URL', example: 'https://example.com/banner.jpg' })
    @IsOptional()
    @IsString()
    banner?: string;

    @ApiPropertyOptional({ description: 'Banner ID', example: 'BANNER-123' })
    @IsOptional()
    @IsString()
    banner_id?: string;

    @ApiPropertyOptional({ description: 'Business motto', example: 'Quality Coffee Since 2020' })
    @IsOptional()
    @IsString()
    motto?: string;

    @ApiPropertyOptional({ description: 'Tax compliance number', example: 'TAX-123456' })
    @IsOptional()
    @IsString()
    tax_compliance_number?: string;

    @ApiPropertyOptional({ description: 'Business description', example: 'Specialty coffee roaster' })
    @IsOptional()
    @IsString()
    description?: string;

    @ApiPropertyOptional({ description: 'Phone number', example: '+1234567890' })
    @IsOptional()
    @IsString()
    phone_number?: string;

    @ApiPropertyOptional({ description: 'Trade sector', example: 'Food & Beverage' })
    @IsOptional()
    @IsString()
    trade_sector?: string;

    @ApiPropertyOptional({ description: 'Entrepreneur role', example: 'founder' })
    @IsOptional()
    @IsString()
    entreprenuer_role?: string;

    @ApiPropertyOptional({
        description: 'Business stage',
        example: 'growth',
        enum: ['startup', 'growth', 'established', 'mature']
    })
    @IsOptional()
    @IsString()
    business_stage?: string;

    @ApiPropertyOptional({ description: 'Specialization', example: 'Coffee Roasting' })
    @IsOptional()
    @IsString()
    specialization?: string;

    @ApiPropertyOptional({ description: 'Neighborhood', example: 'Downtown' })
    @IsOptional()
    @IsString()
    neighbourhood?: string;

    @ApiPropertyOptional({ description: 'City', example: 'Seattle' })
    @IsOptional()
    @IsString()
    city?: string;

    @ApiPropertyOptional({ description: 'Country', example: 'United States' })
    @IsOptional()
    @IsString()
    country?: string;

    @ApiPropertyOptional({ description: 'Additional specialization', example: 'Organic Products' })
    @IsOptional()
    @IsString()
    additional_specialization?: string;

    @ApiPropertyOptional({ description: 'Website URL', example: 'https://premiumroasters.com' })
    @IsOptional()
    @IsString()
    website?: string;

    @ApiPropertyOptional({ description: 'Review rating', example: 4.8 })
    @IsOptional()
    @IsNumber()
    review_rating?: number;
}
// src/business/dto/business-response.dto.ts
// import { ProfileResponseDto } from '../../profile/dto/profile-response.dto';
// import { ProductResponseDto } from '../../product/dto/product-response.dto';
// import { CartItemResponseDto } from '../../cart-item/dto/cart-item-response.dto';

export class BusinessResponseDto {
    @ApiProperty({ description: 'Auto-generated collection ID', example: 1234567 })
    collectionId: number;

    @ApiProperty({ description: 'Business ID', example: 'BUS-12345' })
    id: string;

    @ApiProperty({ description: 'Entrepreneur ID', example: 'ENT-123', required: false })
    entreprenuerId: string;

    @ApiProperty({ type: () => ProfileResponseDto, required: false })
    profile: ProfileResponseDto;

    @ApiProperty({ description: 'Admin user ID', example: 'ADMIN-123', required: false })
    admin_user_id: string;

    @ApiProperty({ description: 'Business logo URL', example: 'https://example.com/logo.png', required: false })
    logo: string;

    @ApiProperty({ description: 'Logo ID', example: 'LOGO-123', required: false })
    logo_id: string;

    @ApiProperty({ description: 'Business banner URL', example: 'https://example.com/banner.jpg', required: false })
    banner: string;

    @ApiProperty({ description: 'Banner ID', example: 'BANNER-123', required: false })
    banner_id: string;

    @ApiProperty({ description: 'Business trading name', example: 'Premium Roasters Inc.' })
    trading_name: string;

    @ApiProperty({ description: 'Business motto', example: 'Quality Coffee Since 2020', required: false })
    motto: string;

    @ApiProperty({ description: 'Admin role', example: 'owner', required: false })
    admin_role: string;

    @ApiProperty({ description: 'Tax compliance number', example: 'TAX-123456', required: false })
    tax_compliance_number: string;

    @ApiProperty({ description: 'Business description', example: 'Specialty coffee roaster', required: false })
    description: string;

    @ApiProperty({ description: 'Phone number', example: '+1234567890', required: false })
    phone_number: string;

    @ApiProperty({ description: 'Trade sector', example: 'Food & Beverage', required: false })
    trade_sector: string;

    @ApiProperty({ description: 'Entrepreneur role', example: 'founder', required: false })
    entreprenuer_role: string;

    @ApiProperty({
        description: 'Business stage',
        example: 'growth',
        enum: ['startup', 'growth', 'established', 'mature'],
        required: false
    })
    business_stage: string;

    @ApiProperty({ description: 'Specialization', example: 'Coffee Roasting', required: false })
    specialization: string;

    @ApiProperty({ description: 'Neighborhood', example: 'Downtown', required: false })
    neighbourhood: string;

    @ApiProperty({ description: 'City', example: 'Seattle', required: false })
    city: string;

    @ApiProperty({ description: 'Country', example: 'United States', required: false })
    country: string;

    @ApiProperty({ description: 'Additional specialization', example: 'Organic Products', required: false })
    additional_specialization: string;

    @ApiProperty({ description: 'Website URL', example: 'https://premiumroasters.com', required: false })
    website: string;

    @ApiProperty({ description: 'Creation date', example: '2023-01-01T00:00:00.000Z', required: false })
    createdAt: string;

    @ApiProperty({ description: 'Last update date', example: '2023-01-15T00:00:00.000Z', required: false })
    updatedAt: string;

    @ApiProperty({ description: 'Review rating', example: 4.8, required: false })
    review_rating: number;

    @ApiProperty({ type: () => [InventoryResponseDto], required: false })
    products: InventoryResponseDto[];

    @ApiProperty({ type: () => [CartItemResponseDto], required: false })
    sales: CartItemResponseDto[];
}


export class StoreResponseDto {
    @ApiProperty({ description: 'Store ID', example: 'STORE-123' })
    id: string;

    @ApiProperty({ description: 'Store name', example: 'Downtown Coffee Shop' })
    trading_name: string;

    // Add other store fields as needed
}

export class ProductImageResponseDto {
    @ApiProperty({ description: 'Image ID', example: 'IMG-123' })
    id: string;

    @ApiProperty({ description: 'Image URL', example: 'https://example.com/image.jpg' })
    url: string;

    // Add other image fields as needed
}