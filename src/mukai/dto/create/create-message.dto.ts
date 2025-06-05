export class CreateMessageDto {
    @IsString()
    @IsOptional()
    id: uuid;

    @IsString()
    @IsOptional()
    profile_id: uuid;

    @IsString()
    @IsOptional()
    content: string;

    @IsString()
    @IsOptional()
    content_format: string;

    @IsString()
    @IsOptional()
    message_timestamp: string;

    @IsString()
    @IsOptional()
    ref_key: string;

    @IsString()
    @IsOptional()
    chat_id: uuid;
}
