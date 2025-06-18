import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNumber, IsDateString, IsOptional } from 'class-validator';

export class CreateSpendingConditionsDto {
  @ApiProperty({
    example: 1000,
    description: 'Target spending amount',
    required: true,
  })
  @IsNumber()
  target_amount: number;

  @ApiProperty({
    example: '2023-12-31',
    description: 'Target completion date',
    required: true,
  })
  @IsDateString()
  target_date: string;

  @ApiPropertyOptional({
    example: 'Q1 Marketing Budget',
    description: 'Milestone description',
  })
  @IsOptional()
  @IsString()
  milestone?: string;

  @ApiPropertyOptional({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'Associated wallet ID',
  })
  @IsOptional()
  @IsString()
  wallet_id?: string;
}
