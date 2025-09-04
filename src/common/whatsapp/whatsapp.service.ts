/* eslint-disable @typescript-eslint/no-unsafe-function-type */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable, Logger } from '@nestjs/common';
import { WhatsAppRequestDto } from './requests/whatsapp.requests.dto';
import { GeneralErrorResponseDto } from '../dto/general-error-response.dto';
import { plainToInstance } from 'class-transformer';
import { WhatsAppSuccessResponseDto } from './responses/whatsapp.responses.dto';

function initLogger(funcname: Function): Logger {
  return new Logger(funcname.name);
}

@Injectable()
export class WhatsAppService {
  private readonly baseUrl: string;
  private readonly version: string;
  private readonly phoneNumberID: string;
  private readonly accessToken: string;
  private readonly logger = initLogger(WhatsAppService);

  constructor() {
    this.baseUrl = process.env.WHATSAPP_CLOUD_API_BASE_URL || 'No WhatsApp URL';
    this.version = 'v22.0';
    this.phoneNumberID =
      process.env.WHATSAPP_CLOUD_API_PHONE_NUMBER_ID || 'No phone number ID';
    this.accessToken =
      process.env.WHATSAPP_CLOUD_API_ACCESS_TOKEN || 'No access token';
  }

  private getHeaders() {
    const headers = new Headers({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.accessToken}`,
    });
    return headers;
  }

  async sendMessage(
    message: WhatsAppRequestDto,
  ): Promise<boolean | GeneralErrorResponseDto> {
    try {
      this.logger.log(
        `Sending WhatsApp message using ${JSON.stringify(message)}`,
      );
      const req = {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(message),
        // redirect: 'follow',
      } as RequestInit;
      const response = await fetch(
        `${this.baseUrl}/${this.version}/${this.phoneNumberID}/messages`,
        req,
      );
      const responseJson = await response.json();
      this.logger.debug(`API response: ${JSON.stringify(responseJson)}`);
      const formattedResponse = plainToInstance(
        WhatsAppSuccessResponseDto,
        responseJson,
      );
      if (!(formattedResponse instanceof WhatsAppSuccessResponseDto)) {
        return new GeneralErrorResponseDto(
          400,
          'Failed to parse WhatsApp response',
          formattedResponse,
        );
      }
      this.logger.log('Sent!');
      return true;
    } catch (e) {
      return new GeneralErrorResponseDto(500, 'sendMessage error', e);
    }
  }
}
