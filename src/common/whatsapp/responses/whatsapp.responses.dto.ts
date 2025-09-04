export class WhatsAppSuccessResponseDto {
  messaging_product: string;
  contacts: [
    {
      input: string;
      wa_id: string;
    },
  ];
  messages: [
    {
      id: string;
      message_status: string;
    },
  ];
}

export class WhatsAppErrorResponseDto {
  error: {
    message: string;
    type: string;
    code: number;
    fbtrace_id: string;
  };
}
