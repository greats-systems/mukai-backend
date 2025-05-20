// src/common/dto/error-response.dto.ts
export class ErrorResponseDto {
  constructor(
    public readonly statusCode: number,
    public readonly message: string,
    public readonly error?: string,
  ) {}
}
