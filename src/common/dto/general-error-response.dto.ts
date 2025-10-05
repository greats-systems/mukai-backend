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
export class GeneralErrorResponseDto {
  @ApiProperty({
    example: 400,
    description: 'HTTP status code of the error',
    minimum: 400,
    maximum: 599,
    required: true,
  })
  public readonly statusCode: number;

  @ApiProperty({
    example: 'Invalid input data',
    description: 'Human-readable error message',
    required: true,
  })
  public readonly message?: string;
  public readonly errorObject?: object;

  constructor(statusCode: number, message?: string, errorObject?: object) {
    this.statusCode = statusCode;
    this.message = message;
    this.errorObject = errorObject;
  }
}
