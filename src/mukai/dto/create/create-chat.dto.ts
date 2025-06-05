export class CreateChatDto {
    @IsString()
    @IsOptional()
    id?: uuid;

    @IsString()
    @IsOptional()
    ref_key?: string;

    @IsString()
    @IsOptional()
    reciever_id?: uuid;

    @IsString()
    @IsOptional()
    receiver_avatar_id?: string;

    @IsString()
    @IsOptional()
    receiver_first_name?: string;

    @IsString()
    @IsOptional()
    receiver_last_name?: string;

    @IsString()
    @IsOptional()
    profile_id?: string;

    @IsString()
    @IsOptional()
    profile_avatar_id?: string;

    @IsString()
    @IsOptional()
    profile_first_name?: string;

    @IsString()
    @IsOptional()
    profile_last_name?: string;

    @IsString()
    @IsOptional()
    most_recent_content?: string;

    @IsString()
    @IsOptional()
    most_recent_content_format?: string;
}
