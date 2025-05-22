// src/inventory/dto/create-inventory.dto.ts
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
    IsString, IsNumber, IsBoolean, IsOptional, IsArray, IsNotEmpty
} from 'class-validator';

export class CreateInventoryDto {
    @ApiPropertyOptional({ description: 'Product ID', example: 'PROD-12345' })
    @IsOptional()
    @IsString()
    id?: string;

    @ApiPropertyOptional({ description: 'Product status', example: 'active', enum: ['active', 'inactive', 'discontinued'] })
    @IsOptional()
    @IsString()
    status?: string;

    @ApiProperty({ description: 'Product name', example: 'Premium Coffee Beans' })
    @IsNotEmpty()
    @IsString()
    name: string;

    @ApiPropertyOptional({ description: 'Product description', example: 'Arabica coffee beans from Colombia' })
    @IsOptional()
    @IsString()
    description?: string;

    @ApiPropertyOptional({ description: 'SKU code', example: 'SKU-12345' })
    @IsOptional()
    @IsString()
    sku?: string;

    @ApiPropertyOptional({ description: 'bar_code', example: '123456789012' })
    @IsOptional()
    @IsString()
    bar_code?: string;

    @ApiPropertyOptional({ description: 'QR code', example: 'QR-12345' })
    @IsOptional()
    @IsString()
    qr_code?: string;

    @ApiPropertyOptional({ description: 'Product category', example: 'Beverages' })
    @IsOptional()
    @IsString()
    category?: string;

    // Inventory tracking
    @ApiPropertyOptional({ description: 'Number of issues reported', example: 2 })
    @IsOptional()
    @IsNumber()
    issues?: number;

    @ApiPropertyOptional({ description: 'Quantity sold', example: 150 })
    @IsOptional()
    @IsNumber()
    qtySold?: number;

    @ApiPropertyOptional({ description: 'Purchase price', example: 5.99 })
    @IsOptional()
    @IsNumber()
    purchasePrice?: number;

    @ApiProperty({ description: 'Selling price', example: 12.99 })
    @IsNotEmpty()
    @IsNumber()
    sellingPrice: number;

    @ApiProperty({ description: 'Current quantity in stock', example: 50 })
    @IsNotEmpty()
    @IsNumber()
    quantity: number;

    @ApiPropertyOptional({ description: 'Total stocked inventory', example: 200 })
    @IsOptional()
    @IsNumber()
    stockedInventory?: number;

    @ApiPropertyOptional({ description: 'Current inventory level', example: 50 })
    @IsOptional()
    @IsNumber()
    currentInventory?: number;

    @ApiPropertyOptional({ description: 'Stock availability', example: 'in_stock', enum: ['in_stock', 'out_of_stock', 'low_stock'] })
    @IsOptional()
    @IsString()
    inStock?: string;

    @ApiPropertyOptional({ description: 'Unit of measure', example: 'kg' })
    @IsOptional()
    @IsString()
    unitMeasure?: string;

    // Product details
    @ApiPropertyOptional({ description: 'Product size', example: 1.0 })
    @IsOptional()
    @IsNumber()
    size?: number;

    @ApiPropertyOptional({ description: 'Product color', example: 'Brown' })
    @IsOptional()
    @IsString()
    color?: string;

    @ApiPropertyOptional({ description: 'Product brand', example: 'Premium Roasters' })
    @IsOptional()
    @IsString()
    productBrand?: string;

    @ApiPropertyOptional({ description: 'Product variants', example: ['500g', '1kg'], type: [String] })
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    variants?: string[];

    @ApiPropertyOptional({ description: 'Is this a commodity product?', example: false })
    @IsOptional()
    @IsBoolean()
    is_commodity?: boolean;

    @ApiPropertyOptional({ description: 'Is this product export ready?', example: false })
    @IsOptional()
    @IsBoolean()
    is_export_ready?: boolean;

    // Business information
    @ApiPropertyOptional({ description: 'Business ID', example: 'BUS-12345' })
    @IsOptional()
    @IsString()
    business_id?: string;

    @ApiPropertyOptional({ description: 'Business name', example: 'Premium Roasters Inc.' })
    @IsOptional()
    @IsString()
    business_name?: string;

    @ApiPropertyOptional({ description: 'Business phone number', example: '+1234567890' })
    @IsOptional()
    @IsString()
    business_phone?: string;

    // Store information
    @ApiPropertyOptional({ description: 'Store ID', example: 'STORE-123' })
    @IsOptional()
    @IsString()
    storeId?: string;

    @ApiPropertyOptional({ description: 'Store name', example: 'Downtown Coffee Shop' })
    @IsOptional()
    @IsString()
    storeName?: string;

    @ApiPropertyOptional({ description: 'Store logo URL', example: 'https://example.com/store-logo.png' })
    @IsOptional()
    @IsString()
    storeLogo?: string;

    @ApiPropertyOptional({ description: 'Store admin ID', example: 'STORE-ADMIN-123' })
    @IsOptional()
    @IsString()
    storeAdminId?: string;

    @ApiPropertyOptional({ description: 'Store phone number', example: '+1234567891' })
    @IsOptional()
    @IsString()
    storePhone?: string;

    @ApiPropertyOptional({ description: 'Store specialization', example: 'Retail Coffee' })
    @IsOptional()
    @IsString()
    storeSpecialization?: string;

    @ApiPropertyOptional({ description: 'Store review rating', example: 4.5 })
    @IsOptional()
    @IsNumber()
    storeReviewRating?: number;

    // Location
    @ApiPropertyOptional({ description: 'Country', example: 'United States' })
    @IsOptional()
    @IsString()
    country?: string;

    @ApiPropertyOptional({ description: 'City', example: 'Seattle' })
    @IsOptional()
    @IsString()
    city?: string;

    @ApiPropertyOptional({ description: 'Neighborhood', example: 'Downtown' })
    @IsOptional()
    @IsString()
    neighbourhood?: string;

    @ApiPropertyOptional({ description: 'Location coordinates', example: '47.6062,-122.3321' })
    @IsOptional()
    @IsString()
    locationCoordinates?: string;

    // Media
    @ApiPropertyOptional({ description: 'Thumbnail image URL', example: 'https://example.com/thumbnail.jpg' })
    @IsOptional()
    @IsString()
    thumbnail?: string;

    @ApiPropertyOptional({ description: 'List of media IDs', example: ['IMG-1', 'IMG-2'], type: [String] })
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    mediaIds?: string[];

    @ApiPropertyOptional({ description: 'Trading platforms', example: ['Amazon', 'Etsy'], type: [String] })
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    tradingPlatforms?: string[];

    // Dates
    @ApiPropertyOptional({ description: 'Creation date', example: '2023-01-01T00:00:00.000Z' })
    @IsOptional()
    @IsString()
    createdAt?: string;

    @ApiPropertyOptional({ description: 'Last update date', example: '2023-01-15T00:00:00.000Z' })
    @IsOptional()
    @IsString()
    updatedAt?: string;

    @ApiPropertyOptional({ description: 'Next restocking date', example: '2023-02-01T00:00:00.000Z' })
    @IsOptional()
    nextRestockingDate?: Date;

    // Flags
    @ApiPropertyOptional({ description: 'Is in current sale order?', example: false })
    @IsOptional()
    @IsBoolean()
    isInCurrentSaleOrder?: boolean;

    @ApiPropertyOptional({ description: 'Recently updated flag', example: true })
    @IsOptional()
    @IsBoolean()
    recentlyUpdated?: boolean;

    // Stats
    @ApiPropertyOptional({ description: 'Number of likes', example: 25 })
    @IsOptional()
    @IsNumber()
    likes?: number;

    @ApiPropertyOptional({ description: 'Number of views', example: 1000 })
    @IsOptional()
    @IsNumber()
    views?: number;

    @ApiPropertyOptional({ description: 'Number of sales', example: 150 })
    @IsOptional()
    @IsNumber()
    sales?: number;

    @ApiPropertyOptional({ description: 'Number of completed sales', example: 145 })
    @IsOptional()
    @IsNumber()
    completedSales?: number;
}


export class CreateDemandRequestInventoryDto {

    @ApiProperty({ description: 'Product name', example: 'Premium Coffee Beans' })
    @IsNotEmpty()
    @IsString()
    name: string;

    @ApiPropertyOptional({ description: 'Product description', example: 'Arabica coffee beans from Colombia' })
    @IsOptional()
    @IsString()
    description?: string;

    @ApiPropertyOptional({ description: 'bar_code', example: '123456789012' })
    @IsOptional()
    @IsString()
    bar_code?: string;

    @ApiPropertyOptional({ description: 'QR code', example: 'QR-12345' })
    @IsOptional()
    @IsString()
    qr_code?: string;

    @ApiPropertyOptional({ description: 'Product category', example: 'Beverages' })
    @IsOptional()
    @IsString()
    category?: string;

    @ApiProperty({ description: 'Selling price', example: 12.99 })
    @IsNotEmpty()
    @IsNumber()
    price: number;

    @ApiProperty({ description: 'Current quantity in stock', example: 50 })
    @IsNotEmpty()
    @IsNumber()
    quantity: number;

    @ApiPropertyOptional({ description: 'Unit of measure', example: 'kg' })
    @IsOptional()
    @IsString()
    unit_measure?: string;

    @ApiPropertyOptional({ description: 'Is this a commodity product?', example: false })
    @IsOptional()
    @IsBoolean()
    is_commodity?: boolean;

    @ApiPropertyOptional({ description: 'Is this product export ready?', example: false })
    @IsOptional()
    @IsBoolean()
    is_export_ready?: boolean;

    // Location
    @ApiPropertyOptional({ description: 'Country', example: 'United States' })
    @IsOptional()
    @IsString()
    country?: string;

    @ApiPropertyOptional({ description: 'City', example: 'Seattle' })
    @IsOptional()
    @IsString()
    city?: string;

    @ApiPropertyOptional({ description: 'Neighborhood', example: 'Downtown' })
    @IsOptional()
    @IsString()
    neighbourhood?: string;

    @ApiPropertyOptional({ description: 'Location coordinates', example: ['47.6062', '-122.3321'] })
    @IsOptional()
    @IsString()
    location_coordinates?: string[];

    // Media
    @ApiPropertyOptional({ description: 'Thumbnail image URL', example: 'products/product_images/0dfe15aa-71a0-4c01-b2d7-8895f18217d8.jpg' })
    @IsOptional()
    @IsString()
    thumbnail?: string;

    @ApiPropertyOptional({ description: 'List of images', example: ['IMG-1', 'IMG-2'], type: [String] })
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    images?: string[];

    @ApiPropertyOptional({ description: 'Product variants', example: [{ 'size': 'small', 'weight': '500g', 'color': '1kg', 'brand': 'no-label' }], type: [String] })
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    variants?: object[];

    @ApiProperty({ description: 'Order ID', example: '2884ed1c-9a32-46c9-bb9d-954f40abd69c' })
    @IsString()
    order_id?: string;
}


export class CreateDemandRequestOfferDto {
    @ApiProperty({ description: 'Order ID', example: '2884ed1c-9a32-46c9-bb9d-954f40abd69c' })
    @IsString()
    order_id?: string;
    
    @IsString()
    id: string;

    @ApiPropertyOptional({ description: 'Product description', example: 'Arabica coffee beans from Colombia' })
    @IsOptional()
    @IsString()
    message?: string;

    @ApiPropertyOptional({ description: 'Product category', example: 'Beverages' })
    @IsOptional()
    @IsString()
    category?: string;

    @ApiProperty({ description: 'Offer amount', example: 12.99 })
    @IsNotEmpty()
    @IsNumber()
    provider_price_offer: number;

    @ApiProperty({ description: 'Current quantity in stock', example: 50 })
    @IsNotEmpty()
    @IsNumber()
    quantity: number;

    @ApiPropertyOptional({ description: 'Unit of measure', example: 'kg' })
    @IsOptional()
    @IsString()
    unit_measure?: string;

    @ApiPropertyOptional({ description: 'Is this a commodity product?', example: false })
    @IsOptional()
    @IsBoolean()
    is_commodity?: boolean;

    @ApiPropertyOptional({ description: 'Is this product export ready?', example: false })
    @IsOptional()
    @IsBoolean()
    is_export_ready?: boolean;

    // Location
    @ApiPropertyOptional({ description: 'Country', example: 'United States' })
    @IsOptional()
    @IsString()
    country?: string;

    @ApiPropertyOptional({ description: 'City', example: 'Seattle' })
    @IsOptional()
    @IsString()
    city?: string;

    @ApiPropertyOptional({ description: 'Neighborhood', example: 'Downtown' })
    @IsOptional()
    @IsString()
    neighbourhood?: string;

    @ApiPropertyOptional({ description: 'Location coordinates', example: ['47.6062', '-122.3321'] })
    @IsOptional()
    @IsString()
    location_coordinates?: string[];

    // Media
    @ApiPropertyOptional({ description: 'Thumbnail image URL', example: 'products/product_images/0dfe15aa-71a0-4c01-b2d7-8895f18217d8.jpg' })
    @IsOptional()
    @IsString()
    thumbnail?: string;

    @ApiPropertyOptional({ description: 'List of images', example: ['IMG-1', 'IMG-2'], type: [String] })
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    images?: string[];

    @ApiPropertyOptional({ description: 'Product variants', example: [{ 'size': 'small', 'weight': '500g', 'color': '1kg', 'brand': 'no-label' }], type: [String] })
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    variants?: object[];


}