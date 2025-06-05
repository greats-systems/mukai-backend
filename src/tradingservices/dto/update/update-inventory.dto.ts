// src/inventory/dto/inventory-response.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import {
  BusinessResponseDto,
  ProductImageResponseDto,
  StoreResponseDto,
} from 'src/organizations/dto/create-organization.dto';
import { ProfileResponseDto } from 'src/user/dto/create-user.dto';

export class InventoryResponseDto {
  @ApiProperty({
    description: 'Auto-generated collection ID',
    example: 123456789,
  })
  collectionId: number;

  // Identification and basic info
  @ApiProperty({ description: 'Product ID', example: 'PROD-12345' })
  id: string;

  @ApiProperty({
    description: 'Product status',
    example: 'active',
    enum: ['active', 'inactive', 'discontinued'],
  })
  status: string;

  @ApiProperty({ description: 'Product name', example: 'Premium Coffee Beans' })
  name: string;

  @ApiProperty({
    description: 'Product description',
    example: 'Arabica coffee beans from Colombia',
    required: false,
  })
  description: string;

  @ApiProperty({
    description: 'SKU code',
    example: 'SKU-12345',
    required: false,
  })
  sku: string;

  @ApiProperty({
    description: 'Barcode',
    example: '123456789012',
    required: false,
  })
  barCode: string;

  @ApiProperty({ description: 'QR code', example: 'QR-12345', required: false })
  qrCode: string;

  @ApiProperty({
    description: 'Product category',
    example: 'Beverages',
    required: false,
  })
  category: string;

  // Inventory tracking
  @ApiProperty({
    description: 'Number of issues reported',
    example: 2,
    required: false,
  })
  issues: number;

  @ApiProperty({ description: 'Quantity sold', example: 150, required: false })
  qtySold: number;

  @ApiProperty({
    description: 'Purchase price',
    example: 5.99,
    required: false,
  })
  purchasePrice: number;

  @ApiProperty({
    description: 'Selling price',
    example: 12.99,
    required: false,
  })
  sellingPrice: number;

  @ApiProperty({
    description: 'Current quantity in stock',
    example: 50,
    required: false,
  })
  quantity: number;

  @ApiProperty({
    description: 'Total stocked inventory',
    example: 200,
    required: false,
  })
  stockedInventory: number;

  @ApiProperty({
    description: 'Current inventory level',
    example: 50,
    required: false,
  })
  currentInventory: number;

  @ApiProperty({
    description: 'Stock availability',
    example: 'in_stock',
    enum: ['in_stock', 'out_of_stock', 'low_stock'],
    required: false,
  })
  inStock: string;

  @ApiProperty({
    description: 'Unit of measure',
    example: 'kg',
    required: false,
  })
  unitMeasure: string;

  // Product details
  @ApiProperty({ description: 'Product size', example: 1.0, required: false })
  size: number;

  @ApiProperty({
    description: 'Product color',
    example: 'Brown',
    required: false,
  })
  color: string;

  @ApiProperty({
    description: 'Product brand',
    example: 'Premium Roasters',
    required: false,
  })
  productBrand: string;

  @ApiProperty({
    description: 'Product variants',
    example: ['500g', '1kg'],
    type: [String],
    required: false,
  })
  variants: string[];

  @ApiProperty({
    description: 'Is this a commodity product?',
    example: false,
    required: false,
  })
  isCommodity: boolean;

  @ApiProperty({
    description: 'Is this product export ready?',
    example: false,
    required: false,
  })
  isExportReady: boolean;

  @ApiProperty({
    description: 'Is this product POS enabled?',
    example: true,
    required: false,
  })
  isPosEnabled: boolean;

  // Business information
  @ApiProperty({
    description: 'Business ID',
    example: 'BUS-12345',
    required: false,
  })
  businessId: string;

  @ApiProperty({
    description: 'Business name',
    example: 'Premium Roasters Inc.',
    required: false,
  })
  businessName: string;

  @ApiProperty({
    description: 'Business logo URL',
    example: 'https://example.com/logo.png',
    required: false,
  })
  businessLogo: string;

  @ApiProperty({
    description: 'Business admin ID',
    example: 'ADMIN-123',
    required: false,
  })
  businessAdminId: string;

  @ApiProperty({
    description: 'Business phone number',
    example: '+1234567890',
    required: false,
  })
  businessPhone: string;

  @ApiProperty({
    description: 'Business specialization',
    example: 'Coffee Products',
    required: false,
  })
  businessSpecialization: string;

  @ApiProperty({
    description: 'Business review rating',
    example: 4.8,
    required: false,
  })
  businessReviewRating: number;

  // Store information
  @ApiProperty({
    description: 'Store ID',
    example: 'STORE-123',
    required: false,
  })
  storeId: string;

  @ApiProperty({
    description: 'Store name',
    example: 'Downtown Coffee Shop',
    required: false,
  })
  storeName: string;

  @ApiProperty({
    description: 'Store logo URL',
    example: 'https://example.com/store-logo.png',
    required: false,
  })
  storeLogo: string;

  @ApiProperty({
    description: 'Store admin ID',
    example: 'STORE-ADMIN-123',
    required: false,
  })
  storeAdminId: string;

  @ApiProperty({
    description: 'Store phone number',
    example: '+1234567891',
    required: false,
  })
  storePhone: string;

  @ApiProperty({
    description: 'Store specialization',
    example: 'Retail Coffee',
    required: false,
  })
  storeSpecialization: string;

  @ApiProperty({
    description: 'Store review rating',
    example: 4.5,
    required: false,
  })
  storeReviewRating: number;

  // Location
  @ApiProperty({
    description: 'Country',
    example: 'United States',
    required: false,
  })
  country: string;

  @ApiProperty({ description: 'City', example: 'Seattle', required: false })
  city: string;

  @ApiProperty({
    description: 'Neighborhood',
    example: 'Downtown',
    required: false,
  })
  neighbourhood: string;

  @ApiProperty({
    description: 'Location coordinates',
    example: '47.6062,-122.3321',
    required: false,
  })
  locationCoordinates: string;

  // Media
  @ApiProperty({
    description: 'Thumbnail image URL',
    example: 'https://example.com/thumbnail.jpg',
    required: false,
  })
  thumbnail: string;

  @ApiProperty({
    description: 'List of media IDs',
    example: ['IMG-1', 'IMG-2'],
    type: [String],
    required: false,
  })
  mediaIds: string[];

  @ApiProperty({
    description: 'Trading platforms',
    example: ['Amazon', 'Etsy'],
    type: [String],
    required: false,
  })
  tradingPlatforms: string[];

  // Dates
  @ApiProperty({
    description: 'Creation date',
    example: '2023-01-01T00:00:00.000Z',
    required: false,
  })
  createdAt: string;

  @ApiProperty({
    description: 'Last update date',
    example: '2023-01-15T00:00:00.000Z',
    required: false,
  })
  updatedAt: string;

  @ApiProperty({
    description: 'Next restocking date',
    example: '2023-02-01T00:00:00.000Z',
    required: false,
  })
  nextRestockingDate: Date;

  // Flags
  @ApiProperty({
    description: 'Is in current sale order?',
    example: false,
    required: false,
  })
  isInCurrentSaleOrder: boolean;

  @ApiProperty({
    description: 'Recently updated flag',
    example: true,
    required: false,
  })
  recentlyUpdated: boolean;

  // Stats
  @ApiProperty({ description: 'Number of likes', example: 25, required: false })
  likes: number;

  @ApiProperty({
    description: 'Number of views',
    example: 1000,
    required: false,
  })
  views: number;

  @ApiProperty({
    description: 'Number of sales',
    example: 150,
    required: false,
  })
  sales: number;

  @ApiProperty({
    description: 'Number of completed sales',
    example: 145,
    required: false,
  })
  completedSales: number;

  // Relations
  @ApiProperty({ type: () => BusinessResponseDto, required: false })
  businessProfile: BusinessResponseDto;

  @ApiProperty({ type: () => StoreResponseDto, required: false })
  storeProfile: StoreResponseDto;

  @ApiProperty({ type: () => ProfileResponseDto, required: false })
  profile: ProfileResponseDto;

  @ApiProperty({ type: () => [ProductImageResponseDto], required: false })
  images: ProductImageResponseDto[];
}
