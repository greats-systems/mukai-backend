/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-function-type */
/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { PostgresRest } from 'src/common/postgresrest';
import { v4 } from 'uuid';
import {
  ExpressPaymentSmilePayRequestAuth,
  ExpressPaymentSmilePayRequestConfirm,
} from '../requests/smilepay.requests';
import { SuccessResponseDto } from 'src/common/dto/success-response.dto';
import { ErrorResponseDto } from 'src/common/dto/error-response.dto';
// import axios from 'axios';
import { plainToInstance } from 'class-transformer';
import { ExpressPaymentSmilePayResponse } from '../responses/smilepay.responses';
import { GeneralErrorResponseDto } from 'src/common/dto/general-error-response.dto';
// import uuidv4 from 'supabase/apps/studio/lib/uuid';
// import uuidv4 from 'supabase/apps/studio/lib/uuid';

function initLogger(funcname: Function): Logger {
  return new Logger(funcname.name);
}

@Injectable()
export class SmilePayService {
  private readonly baseUrl: string;
  private readonly apiKey: string;
  private readonly apiSecret: string;
  private readonly logger = initLogger(SmilePayService);

  constructor(private readonly postgresrest: PostgresRest) {
    this.baseUrl = process.env.SMILEPAY_API_URL || '';
    this.apiKey = process.env.SMILEPAY_API_KEY || '';
    this.apiSecret = process.env.SMILEPAY_API_SECRET || '';
  }

  private getHeaders() {
    const headers = new Headers({
      'Content-Type': 'application/json',
      'x-api-key': `${this.apiKey}`,
      'x-api-secret': `${this.apiSecret}`,
    });
    return headers;
  }

  async initiateExpressCheckoutSmilePay(
    authRequest: ExpressPaymentSmilePayRequestAuth,
  ): Promise<SuccessResponseDto | ErrorResponseDto> {
    try {
      this.logger.debug(`Initiating SmilePay payment using ${this.baseUrl}`);
      this.logger.debug(`Auth request: ${JSON.stringify(authRequest)}`);
      authRequest.orderReference = v4();
      const requestOptions = {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(authRequest),
        redirect: 'follow',
      } as RequestInit;
      this.logger.log(JSON.stringify(authRequest));
      const authResponse = await fetch(
        `${this.baseUrl}/payments/express-checkout/zb-payment`,
        requestOptions,
      );
      const authResponseJson = await authResponse.json();
      this.logger.debug(`authResponse: ${JSON.stringify(authResponseJson)}`);
      const parsedResponse = plainToInstance(
        ExpressPaymentSmilePayResponse,
        authResponseJson,
      );
      if (parsedResponse.responseCode !== '00') {
        return new GeneralErrorResponseDto(
          HttpStatus.BAD_REQUEST,
          'Failed to authorize payment request',
          parsedResponse,
        );
      }
      this.logger.log('Success');
      return new SuccessResponseDto(
        HttpStatus.OK,
        'Waiting for authorization',
        authResponseJson as ExpressPaymentSmilePayResponse,
      );
    } catch (error) {
      this.logger.debug(`InitiateExpressCheckoutSmilePay error: ${error}`);
      return new GeneralErrorResponseDto(
        500,
        'InitiateExpressCheckoutSmilePay error',
        error,
      );
    }
  }

  async confirmExpressCheckoutSmilePay(
    confirmRequest: ExpressPaymentSmilePayRequestConfirm,
  ): Promise<SuccessResponseDto | ErrorResponseDto> {
    try {
      this.logger.debug('Confirming SmilePay payment');
      const requestOptions = {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(confirmRequest),
        redirect: 'follow',
      } as RequestInit;
      const confirmResponse = await fetch(
        `${this.baseUrl}/payments/express-checkout/zb-payment/confirmation`,
        requestOptions,
      );
      const confirmResponseJson = await confirmResponse.json();
      const parsedResponse = plainToInstance(
        ExpressPaymentSmilePayResponse,
        confirmResponseJson,
      );
      if (parsedResponse.responseCode != '00') {
        this.logger.debug(
          `Error confirming payment: ${JSON.stringify(confirmResponseJson)}`,
        );
        return new GeneralErrorResponseDto(
          400,
          'Failed to confirm payment',
          parsedResponse,
        );
      }
      this.logger.log(JSON.stringify(confirmResponseJson));
      return new SuccessResponseDto(200, 'Payment successful', parsedResponse);
    } catch (error) {
      this.logger.debug(`confirmExpressCheckoutSmilePay error: ${error} `);
      return new GeneralErrorResponseDto(
        500,
        'confirmExpressCheckoutSmilePay error',
        error,
      );
    }
  }
}
