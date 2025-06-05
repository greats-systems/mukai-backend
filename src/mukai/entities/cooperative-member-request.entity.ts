export class CooperativeMemberRequest {
    id: uuid;
    updated_at: string;
    coop_id: uuid;
    member_id: uuid;
    request_type: string;
    status: string;
    resolved_by: uuid;
    message: string;
    profile_first_name: string;
    profile_last_name: string;
    most_recent_content: string;
    most_recent_content_format: string;
}