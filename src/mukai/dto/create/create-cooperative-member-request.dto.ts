export class CreateCooperativeMemberRequestDto {
    @IsString()
    @IsOptional()
    id?: uuid;

    @IsString()
    @IsOptional()
    updated_at?: string;

    @IsString()
    @IsOptional()
    coop_id?: uuid;

    @IsString()
    @IsOptional()
    member_id?: uuid;

    @IsString()
    @IsOptional()
    request_type?: string;

    @IsString()
    @IsOptional()
    status?: string;

    @IsString()
    @IsOptional()
    resolved_by?: uuid;

    @IsString()
    @IsOptional()
    message?: string;

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