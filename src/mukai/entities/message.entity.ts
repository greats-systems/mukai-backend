export class Message {
    id: uuid;
    profile_id: uuid;
    content: string;
    content_format: string;
    message_timestamp: string;
    ref_key: string;
    chat_id: uuid;
}
