// src/inventory/entities/inventory.entity.ts
import {
  Entity,
  PrimaryColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Profile } from 'src/user/entities/user.entity';
import { Business } from 'src/organizations/entities/organization.entity';
// import { Business } from '../../business/entities/business.entity';
// import { Store } from '../../store/entities/store.entity';
// import { ProductImage } from '../../product-image/entities/product-image.entity';
// import { Profile } from '../../profile/entities/profile.entity';

@Entity()
export class Inventory {
  @ApiProperty({
    description: 'Auto-generated collection ID',
    example: 123456789,
  })
  @PrimaryColumn()
  collectionId: number;

  // Identification and basic info
  @ApiProperty({ description: 'Product ID', example: 'PROD-12345' })
  @Column({ nullable: true })
  id: string;

  @ApiProperty({
    description: 'Product status',
    example: 'active',
    enum: ['active', 'inactive', 'discontinued'],
  })
  @Column({ nullable: true })
  status: string;

  @ApiProperty({ description: 'Product name', example: 'Premium Coffee Beans' })
  @Column()
  name: string;

  @ApiProperty({
    description: 'Product description',
    example: 'Arabica coffee beans from Colombia',
    required: false,
  })
  @Column({ nullable: true })
  description: string;

  @ApiProperty({
    description: 'SKU code',
    example: 'SKU-12345',
    required: false,
  })
  @Column({ nullable: true })
  sku: string;

  @ApiProperty({
    description: 'Barcode',
    example: '123456789012',
    required: false,
  })
  @Column({ name: 'bar_code', nullable: true })
  barCode: string;

  @ApiProperty({ description: 'QR code', example: 'QR-12345', required: false })
  @Column({ name: 'qr_code', nullable: true })
  qrCode: string;

  @ApiProperty({
    description: 'Product category',
    example: 'Beverages',
    required: false,
  })
  @Column({ nullable: true })
  category: string;

  // Inventory tracking
  @ApiProperty({
    description: 'Number of issues reported',
    example: 2,
    required: false,
  })
  @Column({ type: 'float', nullable: true })
  issues: number;

  @ApiProperty({ description: 'Quantity sold', example: 150, required: false })
  @Column({ name: 'qty_sold', type: 'float', nullable: true })
  qtySold: number;

  @ApiProperty({
    description: 'Purchase price',
    example: 5.99,
    required: false,
  })
  @Column({ name: 'purchase_price', type: 'float', nullable: true })
  purchasePrice: number;

  @ApiProperty({
    description: 'Selling price',
    example: 12.99,
    required: false,
  })
  @Column({ name: 'selling_price', type: 'float', nullable: true })
  sellingPrice: number;

  @ApiProperty({
    description: 'Current quantity in stock',
    example: 50,
    required: false,
  })
  @Column({ type: 'float', nullable: true })
  quantity: number;

  @ApiProperty({
    description: 'Total stocked inventory',
    example: 200,
    required: false,
  })
  @Column({ name: 'stocked_inventory', type: 'float', nullable: true })
  stockedInventory: number;

  @ApiProperty({
    description: 'Current inventory level',
    example: 50,
    required: false,
  })
  @Column({ name: 'current_inventory', type: 'float', nullable: true })
  currentInventory: number;

  @ApiProperty({
    description: 'Stock availability',
    example: 'in_stock',
    enum: ['in_stock', 'out_of_stock', 'low_stock'],
    required: false,
  })
  @Column({ name: 'in_stock', nullable: true })
  inStock: string;

  @ApiProperty({
    description: 'Unit of measure',
    example: 'kg',
    required: false,
  })
  @Column({ name: 'unit_measure', nullable: true })
  unitMeasure: string;

  // Product details
  @ApiProperty({ description: 'Product size', example: 1.0, required: false })
  @Column({ type: 'float', nullable: true })
  size: number;

  @ApiProperty({
    description: 'Product color',
    example: 'Brown',
    required: false,
  })
  @Column({ nullable: true })
  color: string;

  @ApiProperty({
    description: 'Product brand',
    example: 'Premium Roasters',
    required: false,
  })
  @Column({ name: 'product_brand', nullable: true })
  productBrand: string;

  @ApiProperty({
    description: 'Product variants',
    example: ['500g', '1kg'],
    type: [String],
    required: false,
  })
  @Column('simple-array', { nullable: true })
  variants: string[];

  @ApiProperty({
    description: 'Is this a commodity product?',
    example: false,
    required: false,
  })
  @Column({ name: 'is_commodity', default: false })
  isCommodity: boolean;

  @ApiProperty({
    description: 'Is this product export ready?',
    example: false,
    required: false,
  })
  @Column({ name: 'is_export_ready', default: false })
  isExportReady: boolean;

  @ApiProperty({
    description: 'Is this product POS enabled?',
    example: true,
    required: false,
  })
  @Column({ name: 'is_pos_enabled', default: false })
  isPosEnabled: boolean;

  // Business information
  @ApiProperty({
    description: 'Business ID',
    example: 'BUS-12345',
    required: false,
  })
  @Column({ name: 'business_id', nullable: true })
  businessId: string;

  @ApiProperty({
    description: 'Business name',
    example: 'Premium Roasters Inc.',
    required: false,
  })
  @Column({ name: 'business_name', nullable: true })
  businessName: string;

  @ApiProperty({
    description: 'Business logo URL',
    example: 'https://example.com/logo.png',
    required: false,
  })
  @Column({ name: 'business_logo', nullable: true })
  businessLogo: string;

  @ApiProperty({
    description: 'Business admin ID',
    example: 'ADMIN-123',
    required: false,
  })
  @Column({ name: 'business_admin_id', nullable: true })
  businessAdminId: string;

  @ApiProperty({
    description: 'Business phone number',
    example: '+1234567890',
    required: false,
  })
  @Column({ name: 'business_phone', nullable: true })
  businessPhone: string;

  @ApiProperty({
    description: 'Business specialization',
    example: 'Coffee Products',
    required: false,
  })
  @Column({ name: 'business_specialization', nullable: true })
  businessSpecialization: string;

  @ApiProperty({
    description: 'Business review rating',
    example: 4.8,
    required: false,
  })
  @Column({ name: 'business_review_rating', type: 'float', nullable: true })
  businessReviewRating: number;

  // Store information
  @ApiProperty({
    description: 'Store ID',
    example: 'STORE-123',
    required: false,
  })
  @Column({ name: 'store_id', nullable: true })
  storeId: string;

  @ApiProperty({
    description: 'Store name',
    example: 'Downtown Coffee Shop',
    required: false,
  })
  @Column({ name: 'store_name', nullable: true })
  storeName: string;

  @ApiProperty({
    description: 'Store logo URL',
    example: 'https://example.com/store-logo.png',
    required: false,
  })
  @Column({ name: 'store_logo', nullable: true })
  storeLogo: string;

  @ApiProperty({
    description: 'Store admin ID',
    example: 'STORE-ADMIN-123',
    required: false,
  })
  @Column({ name: 'store_admin_id', nullable: true })
  storeAdminId: string;

  @ApiProperty({
    description: 'Store phone number',
    example: '+1234567891',
    required: false,
  })
  @Column({ name: 'store_phone', nullable: true })
  storePhone: string;

  @ApiProperty({
    description: 'Store specialization',
    example: 'Retail Coffee',
    required: false,
  })
  @Column({ name: 'store_specialization', nullable: true })
  storeSpecialization: string;

  @ApiProperty({
    description: 'Store review rating',
    example: 4.5,
    required: false,
  })
  @Column({ name: 'store_review_rating', type: 'float', nullable: true })
  storeReviewRating: number;

  // Location
  @ApiProperty({
    description: 'Country',
    example: 'United States',
    required: false,
  })
  @Column({ nullable: true })
  country: string;

  @ApiProperty({ description: 'City', example: 'Seattle', required: false })
  @Column({ nullable: true })
  city: string;

  @ApiProperty({
    description: 'Neighborhood',
    example: 'Downtown',
    required: false,
  })
  @Column({ nullable: true })
  neighbourhood: string;

  @ApiProperty({
    description: 'Location coordinates',
    example: '47.6062,-122.3321',
    required: false,
  })
  @Column({ name: 'location_coordinates', nullable: true })
  locationCoordinates: string;

  // Media
  @ApiProperty({
    description: 'Thumbnail image URL',
    example: 'https://example.com/thumbnail.jpg',
    required: false,
  })
  @Column({ nullable: true })
  thumbnail: string;

  @ApiProperty({
    description: 'List of media IDs',
    example: ['IMG-1', 'IMG-2'],
    type: [String],
    required: false,
  })
  @Column('simple-array', { name: 'media_ids', nullable: true })
  mediaIds: string[];

  @ApiProperty({
    description: 'Trading platforms',
    example: ['Amazon', 'Etsy'],
    type: [String],
    required: false,
  })
  @Column('simple-array', { name: 'trading_platforms', nullable: true })
  tradingPlatforms: string[];

  // Dates
  @ApiProperty({
    description: 'Creation date',
    example: '2023-01-01T00:00:00.000Z',
    required: false,
  })
  @Column({ name: 'created_at', nullable: true })
  createdAt: string;

  @ApiProperty({
    description: 'Last update date',
    example: '2023-01-15T00:00:00.000Z',
    required: false,
  })
  @Column({ name: 'updated_at', nullable: true })
  updatedAt: string;

  @ApiProperty({
    description: 'Next restocking date',
    example: '2023-02-01T00:00:00.000Z',
    required: false,
  })
  @Column({ name: 'next_restocking_date', type: 'timestamp', nullable: true })
  nextRestockingDate: Date;

  // Flags
  @ApiProperty({
    description: 'Is in current sale order?',
    example: false,
    required: false,
  })
  @Column({ name: 'is_in_current_sale_order', default: false })
  isInCurrentSaleOrder: boolean;

  @ApiProperty({
    description: 'Recently updated flag',
    example: true,
    required: false,
  })
  @Column({ name: 'recently_updated', default: false })
  recentlyUpdated: boolean;

  // Stats
  @ApiProperty({ description: 'Number of likes', example: 25, required: false })
  @Column({ nullable: true })
  likes: number;

  @ApiProperty({
    description: 'Number of views',
    example: 1000,
    required: false,
  })
  @Column({ nullable: true })
  views: number;

  @ApiProperty({
    description: 'Number of sales',
    example: 150,
    required: false,
  })
  @Column({ nullable: true })
  sales: number;

  @ApiProperty({
    description: 'Number of completed sales',
    example: 145,
    required: false,
  })
  @Column({ name: 'completed_sales', nullable: true })
  completedSales: number;

  // Relations
  @ManyToOne(() => Business, { eager: true })
  @JoinColumn({ name: 'business_id', referencedColumnName: 'id' })
  businessProfile: Business;

  @ManyToOne(() => Business, { eager: true })
  @JoinColumn({ name: 'store_id', referencedColumnName: 'id' })
  storeProfile: Business;

  @ManyToOne(() => Profile, { eager: true })
  @JoinColumn({ name: 'business_admin_id', referencedColumnName: 'id' })
  profile: Profile;

  @OneToMany(() => String, (image) => image)
  images: [];
}
