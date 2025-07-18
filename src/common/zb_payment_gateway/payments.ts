/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import axios from 'axios';

// Types
export interface PaymentInitiateRequest {
  amount: number;
  currency: string;
  customerEmail: string;
  customerName: string;
  customerPhone: string;
  paymentMethod: PaymentMethod;
  reference: string;
  callbackUrl: string;
}

export interface PaymentConfirmRequest {
  paymentId: string;
  otp?: string;
}

export interface PaymentResponse {
  responseMessage?: string;
  responseCode?: string;
  transactionReference?: string;
  orderReference?: string;
  paymentUrl?: string;
  success: boolean;
  paymentId?: string;
  status: PaymentStatus;
  message: string;
  data?: any;
}

export enum PaymentMethod {
  WALLETPLUS = 'WALLETPLUS',
  ECOCASH = 'ECOCASH',
  INNBUCKS = 'INNBUCKS',
  CARD = 'CARD',
  OMARI = 'OMARI',
  ONEMONEY = 'ONEMONEY',
}

export enum PaymentStatus {
  PENDING = 'pending',
  SUCCESS = 'success',
  FAILED = 'failed',
  CANCELLED = 'cancelled',
}

export class SmilePayGateway {
  private readonly baseUrl: string;
  private readonly apiKey: string;

  constructor(baseUrl: string, apiKey: string) {
    this.baseUrl =
      process.env.SMILEPAY_API_URL ||
      'https://zbnet.zb.co.zw/wallet_sandbox_api/payments-gateway';
    this.apiKey = process.env.SMILEPAY_API_KEY || '';
  }

  private getHeaders() {
    return {
      Authorization: `Bearer ${this.apiKey}`,
      'Content-Type': 'application/json',
    };
  }
  async initiateExpressPayment(
    request: PaymentInitiateRequest,
  ): Promise<PaymentResponse> {
    try {
      const myHeaders = new Headers({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.apiKey}`,
        'x-api-key': '871e8710-f769-482c-8ce7-397f294af958',
        'x-api-secret': '74c19649-6876-4a28-85fe-bc76388a92bd',
      });

      const req_data = JSON.stringify({
        orderReference: request.reference,
        amount: request.amount,
        returnUrl: request.callbackUrl,
        resultUrl: request.callbackUrl,
        itemName: 'request.itemName',
        itemDescription: 'request.itemDescription',
        currencyCode: request.currency == 'USD' ? '840' : '840',
        firstName: request.customerName,
        lastName: request.customerName,
        mobilePhoneNumber: request.customerPhone ?? '0777757603',
        email: request.customerEmail,
        cancelUrl: request.callbackUrl,
        failureUrl: request.callbackUrl,
        paymentMethod: request.paymentMethod.toUpperCase(),
        ecocashMobile: request.customerPhone ?? '0777757603',
        omariMobile: request.customerPhone ?? '0777757603',
        zbWalletMobile: request.customerPhone ?? '0711111111',
      });
      console.log('initiateExpressPayment ra', req_data);
      const requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: req_data,
        redirect: 'follow',
      } as RequestInit;
      console.log('requestOptions', requestOptions);
      const paymentMethod =
        request.paymentMethod == PaymentMethod.WALLETPLUS
          ? 'zb-payment'
          : request.paymentMethod.toLowerCase();
      console.log(
        'expressUrl',
        `${this.baseUrl}/payments/express-checkout/${paymentMethod}`,
      );
      const response = await fetch(
        `${this.baseUrl}/payments/express-checkout/${paymentMethod}`,
        requestOptions,
      );
      // console.log('response', response);
      const data = await response.json();
      console.log('response data', data);
      //
      // response data {
      //   responseMessage: 'Awaiting Payment',
      //   responseCode: '00',
      //   status: 'AWAITING_PAYMENT',
      //   transactionReference: 'AOKZ4002LHHC'
      // }
      return {
        success: true,
        paymentId: data['transactionReference'] || '',
        responseMessage: data['responseMessage'] || '',
        responseCode: data['responseCode'] || '',
        transactionReference: data['transactionReference'] || '',
        orderReference: data['orderReference'] || '',
        paymentUrl: data['paymentUrl'] || '',
        status: data.status || PaymentStatus.PENDING,
        message: 'Payment initiated successfully',
        data,
      };
    } catch (error) {
      console.log('initiateExpressPayment error', error);
      return {
        success: false,
        paymentId: '',
        status: PaymentStatus.FAILED,
        message: error.response?.data?.message || 'Failed to initiate payment',
      };
    }
  }

  async confirmPayment(
    request: PaymentConfirmRequest,
  ): Promise<PaymentResponse> {
    try {
      const response = await axios.post(
        `${this.baseUrl}/express-checkout/confirm`,
        request,
        { headers: this.getHeaders() },
      );

      return {
        success: true,
        paymentId: response.data.paymentId,
        status: response.data.status,
        message: 'Payment confirmed successfully',
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        paymentId: request.paymentId,
        status: PaymentStatus.FAILED,
        message: error.response?.data?.message || 'Failed to confirm payment',
        data: error.response?.data,
      };
    }
  }

  async checkPaymentStatus(paymentId: string): Promise<PaymentResponse> {
    try {
      const response = await axios.get(
        `${this.baseUrl}/payment/${paymentId}/status`,
        { headers: this.getHeaders() },
      );

      return {
        success: true,
        paymentId,
        status: response.data.status,
        message: 'Payment status retrieved successfully',
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        paymentId,
        status: PaymentStatus.FAILED,
        message:
          error.response?.data?.message || 'Failed to check payment status',
        data: error.response?.data,
      };
    }
  }

  async cancelPayment(paymentId: string): Promise<PaymentResponse> {
    try {
      const response = await axios.post(
        `${this.baseUrl}/payment/${paymentId}/cancel`,
        {},
        { headers: this.getHeaders() },
      );

      return {
        success: true,
        paymentId,
        status: PaymentStatus.CANCELLED,
        message: 'Payment cancelled successfully',
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        paymentId,
        status: PaymentStatus.FAILED,
        message: error.response?.data?.message || 'Failed to cancel payment',
        data: error.response?.data,
      };
    }
  }
}
