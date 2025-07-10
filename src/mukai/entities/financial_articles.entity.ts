import { ApiProperty } from '@nestjs/swagger';

export class FinancialArticle {
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'Unique identifier for the escrow',
  })
  id: string;

  @ApiProperty({
    example: '2023-10-01T12:00:00Z',
    description: 'Timestamp when the escrow was created',
  })
  created_at: string;

  @ApiProperty({
    example: 'How to accelerate ROI',
    description: 'Name of the financial article',
  })
  article_name: string;

  @ApiProperty({
    example: '987e6543-e21b-43d2-b456-426614174000',
    description: 'Profile ID associated with the financial article',
  })
  profile_id: string;

  @ApiProperty({
    example: 'Accelerate your return on investment with these strategies.',
    description: 'Title of the financial article',
  })
  title: string;

  @ApiProperty({
    example: 'text/html',
    description: 'Content type of the financial article',
  })
  content_type: string;

  @ApiProperty({
    example:
      'Ever wondered how to maximize your investment returns? This article explores various strategies to help you achieve that goal.',
    description: 'Body content of the financial article',
  })
  body: string;

  @ApiProperty({
    example: 'Boosting your financial knowledge is key to success.',
    description: 'Excerpt of the financial article',
  })
  excerpt: string;

  @ApiProperty({
    example: 'https://example.com/cover_image.jpg',
    description: 'Cover image URL for the financial article',
  })
  cover_image: string;

  @ApiProperty({
    example: true,
    description: 'Indicates if the financial article is free to access',
  })
  is_free: boolean;

  @ApiProperty({
    example: 2.0,
    description: 'Price of the financial article',
  })
  price: number;

  @ApiProperty({
    example: 'USD',
    description: 'Currency of the paid financial article',
  })
  currency: string;

  @ApiProperty({
    example: '5-minute read',
    description: 'Estimated reading time for the financial article',
  })
  reading_time: string;

  @ApiProperty({
    example: '2025-12-31T23:59:59Z',
    description: 'Publication date of the financial article',
  })
  published_at: string;

  @ApiProperty({
    example: 'published',
    description: 'Indicates the current status of the financial article',
  })
  status: string;

  @ApiProperty({
    example: 'J. Murray, L. Smith',
    description: 'Tagged authors for the financial article',
  })
  tags: string;

  @ApiProperty({
    example: 500,
    description: 'Number of views for the financial article',
  })
  views_count: number;

  @ApiProperty({
    example: 400,
    description: 'Number of likes for the financial article',
  })
  likes_count: number;

  @ApiProperty({
    example: true,
    description: 'Flag to enable comments for the financial article',
  })
  comments_enabled: boolean;
}
