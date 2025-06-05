import { ApiProperty } from '@nestjs/swagger';
import { PostgrestError } from '@supabase/postgrest-js';

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
export class ErrorResponseDto {
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

  @ApiProperty({
    example: 'Failed to insert/select/update/delete',
  })
  public readonly errorObject?: PostgrestError;

  constructor(
    statusCode: number,
    message?: string,
    errorObject?: PostgrestError,
  ) {
    this.statusCode = statusCode;
    this.message = message;
    this.errorObject = errorObject;
  }
}
