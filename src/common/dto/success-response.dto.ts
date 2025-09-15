import { ApiProperty } from '@nestjs/swagger';

/**
 * Standardized error response format for the API
 *
 * @description
 * This DTO provides a consistent structure for all error responses in the system.
 * It includes:
 * - HTTP status code
 * - Human-readable error message
 * - Optional PostgREST error details for debugging
 */
export class SuccessResponseDto {
  @ApiProperty({
    example: 200,
    description: 'HTTP status code of the success',
    minimum: 200,
    maximum: 599,
    required: true,
  })
  public readonly statusCode: number;

  @ApiProperty({
    example: 'Success',
    description: 'Human-readable success message',
    required: true,
  })
  public readonly message?: string;

  // @ApiProperty({})/
  public readonly data?: any;

  constructor(
    statusCode: number,
    message?: string,
    data?: object | object[] | string | number | boolean,
  ) {
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
  }
}
