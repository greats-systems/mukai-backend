import { PostgrestError } from '@supabase/postgrest-js';

// src/common/dto/error-response.dto.ts
export class ErrorResponseDto {
  constructor(
    public readonly statusCode: number,
    public readonly message?: string,
    public readonly errorObject?: PostgrestError,
  ) {}
}
