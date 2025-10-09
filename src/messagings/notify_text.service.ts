/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import axios, { AxiosRequestConfig } from 'axios';
/*
interface SmsListItem {
  message: string;
  mobiles: string;
  client_ref: string;
}
*/

export class NotifyTextService {
  private readonly username = process.env.NOTIFY_TEXT_USERNAME || '';
  private readonly password = process.env.NOTIFY_TEXT_PASSWORD || '';
  private readonly baseUrl =
    process.env.NOTIFY_TEXT_BASE_URL || 'https://notify.co.zw/sms';

  // Optionally, manage session_id more securely in production
  private sessionId: string = '';

  constructor(sessionId?: string) {
    if (sessionId) {
      this.sessionId = sessionId;
    }
  }

  setSessionId(sessionId: string) {
    this.sessionId = sessionId;
  }

  private getHeaders(): Record<string, string> {
    return {
      'Content-Type': 'application/json',
      ...(this.sessionId ? { Cookie: `session_id=${this.sessionId}` } : {}),
    };
  }

  async checkBalance(): Promise<any> {
    const data = {
      username: this.username,
      password: this.password,
    };

    const config: AxiosRequestConfig = {
      method: 'post',
      maxBodyLength: Infinity,
      url: `${this.baseUrl}/check_balance`,
      headers: this.getHeaders(),
      data,
    };

    const response = await axios.request(config);
    return response.data;
  }

  async sendSms(body: object): Promise<any> {
    const data = {
      username: this.username,
      password: this.password,
      sender: (body as any).sender,
      scheduled_time: (body as any).scheduled_time,
      smslist: (body as any).smslist,
    };

    const config: AxiosRequestConfig = {
      method: 'post',
      maxBodyLength: Infinity,
      url: `${this.baseUrl}/sms_post`,
      headers: this.getHeaders(),
      data,
    };
    // console.debug(`Sending SMS with data: ${JSON.stringify(data)}`);
    const response = await axios.request(config);
    // console.debug(`SMS response: ${response.data}`);
    return response.data;
  }

  async batchStatus(batch_number: string): Promise<any> {
    const data = {
      username: this.username,
      password: this.password,
      batch_number,
    };

    const config: AxiosRequestConfig = {
      method: 'post',
      maxBodyLength: Infinity,
      url: `${this.baseUrl}/batch_status`,
      headers: this.getHeaders(),
      data,
    };

    const response = await axios.request(config);
    return response.data;
  }
}
