export class WhatsAppRequestDto {
  messaging_product: string;
  recipient_type: string;
  to: string;
  type: string;
  text: {
    preview_url: boolean;
    body: string;
  };

  constructor() {
    this.messaging_product = 'whatsapp';
    this.recipient_type = 'individual';
    this.to = '';
    this.type = 'text';
    this.text = {
      preview_url: false,
      body: '',
    };
  }
}
