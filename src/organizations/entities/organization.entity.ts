// src/business/entities/business.entity.ts
import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Profile } from 'src/user/entities/user.entity';
import { Inventory } from 'src/inventories/entities/inventory.entity';
import { CartItem } from 'src/inventories/entities/cart-item.entity';
import { Order } from 'src/orders/entities/order.entity';
// import { Profile } from '../../profile/entities/profile.entity';
// import { Product } from '../../product/entities/product.entity';
// import { CartItem } from '../../cart-item/entities/cart-item.entity';
export class Organization { }

@Entity()
export class Business {
    @ApiProperty({ description: 'Auto-generated collection ID', example: 1234567 })
    @PrimaryColumn()
    collectionId: number;

    @ApiProperty({ description: 'Business ID', example: 'BUS-12345' })
    @Column({ nullable: true })
    id: string;

    @ApiProperty({ description: 'Entrepreneur ID', example: 'ENT-123', required: false })
    @Column({ name: 'entreprenuer_id', nullable: true })
    entreprenuerId: string;

    @ApiProperty({ type: () => Profile, description: 'Business profile information', required: false })
    @ManyToOne(() => Profile, { eager: true })
    @JoinColumn({ name: 'profile_id' })
    profile: Profile;

    @ApiProperty({ description: 'Admin user ID', example: 'ADMIN-123', required: false })
    @Column({ name: 'admin_user_id', nullable: true })
    admin_user_id: string;

    @ApiProperty({ description: 'Business logo URL', example: 'https://example.com/logo.png', required: false })
    @Column({ nullable: true })
    logo: string;

    @ApiProperty({ description: 'Logo ID', example: 'LOGO-123', required: false })
    @Column({ name: 'logo_id', nullable: true })
    logo_id: string;

    @ApiProperty({ description: 'Business banner URL', example: 'https://example.com/banner.jpg', required: false })
    @Column({ nullable: true })
    banner: string;

    @ApiProperty({ description: 'Banner ID', example: 'BANNER-123', required: false })
    @Column({ name: 'banner_id', nullable: true })
    banner_id: string;

    @ApiProperty({ description: 'Business trading name', example: 'Premium Roasters Inc.' })
    @Column({ name: 'trading_name' })
    trading_name: string;

    @ApiProperty({ description: 'Business motto', example: 'Quality Coffee Since 2020', required: false })
    @Column({ nullable: true })
    motto: string;

    @ApiProperty({ description: 'Admin role', example: 'owner', required: false })
    @Column({ name: 'admin_role', nullable: true })
    admin_role: string;

    @ApiProperty({ description: 'Tax compliance number', example: 'TAX-123456', required: false })
    @Column({ name: 'tax_compliance_number', nullable: true })
    tax_compliance_number: string;

    @ApiProperty({ description: 'Business description', example: 'Specialty coffee roaster', required: false })
    @Column({ nullable: true })
    description: string;

    @ApiProperty({ description: 'Phone number', example: '+1234567890', required: false })
    @Column({ name: 'phone_number', nullable: true })
    phone_number: string;

    @ApiProperty({ description: 'Trade sector', example: 'Food & Beverage', required: false })
    @Column({ name: 'trade_sector', nullable: true })
    trade_sector: string;

    @ApiProperty({ description: 'Entrepreneur role', example: 'founder', required: false })
    @Column({ name: 'entreprenuer_role', nullable: true })
    entreprenuer_role: string;

    @ApiProperty({ description: 'Business stage', example: 'growth', enum: ['startup', 'growth', 'established', 'mature'], required: false })
    @Column({ name: 'business_stage', nullable: true })
    business_stage: string;

    @ApiProperty({ description: 'Specialization', example: 'Coffee Roasting', required: false })
    @Column({ nullable: true })
    specialization: string;

    @ApiProperty({ description: 'Neighborhood', example: 'Downtown', required: false })
    @Column({ nullable: true })
    neighbourhood: string;

    @ApiProperty({ description: 'City', example: 'Seattle', required: false })
    @Column({ nullable: true })
    city: string;

    @ApiProperty({ description: 'Country', example: 'United States', required: false })
    @Column({ nullable: true })
    country: string;

    @ApiProperty({ description: 'Additional specialization', example: 'Organic Products', required: false })
    @Column({ name: 'additional_specialization', nullable: true })
    additional_specialization: string;

    @ApiProperty({ description: 'Website URL', example: 'https://premiumroasters.com', required: false })
    @Column({ nullable: true })
    website: string;

    @ApiProperty({ description: 'Creation date', example: '2023-01-01T00:00:00.000Z', required: false })
    @Column({ name: 'created_at', nullable: true })
    createdAt: string;

    @ApiProperty({ description: 'Last update date', example: '2023-01-15T00:00:00.000Z', required: false })
    @Column({ name: 'updated_at', nullable: true })
    updatedAt: string;

    @ApiProperty({ description: 'Review rating', example: 4.8, required: false })
    @Column({ name: 'review_rating', type: 'float', nullable: true })
    review_rating: number;

    @OneToMany(() => Inventory, (product) => product.businessProfile)
    products: Inventory[];

    @OneToMany(() => Order, (order) => order.provider)
    sales: Order[];
}