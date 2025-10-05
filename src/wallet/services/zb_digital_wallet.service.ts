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
export interface CreateSubscriberRequest {
  firstName: string;
  lastName: string;
  mobile: string;
  dateOfBirth: string;
  idNumber: string;
  gender: string;
  source: string;
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

// SET PASSWORD
// Wallet To Bank Auth
// Wallet to bank other Payment
// Payment Auth
// Wallet To Wallet Payment
// Bank to wallet other payment
// Wallet to bank Payment
// Wallet to bank other Auth
// Cash out Auth
// Cash out Payment
// Bill Payment Auth
// Bill Payment Payment
// Bank To Wallet Auth
// Bank to wallet Payment
// Bank to wallet other auth
// Bank to wallet other payment
// Balance Enquiry Auth
// Balance Enquiry Payment
// "ProcessMiniStatement",
// "ProcessCashOut",
// "ProcessBankToWallet",
// "ProcessPosPurchase",
// "LinkBankAccount",
// "ProcessPayment",
// "ProcessRtgs",
// "ProcessWalletToBankOther",
// "ProcessPosWithdrawal",
// "ProcessBillPayment",
// "ProcessBalanceEnquiry",
// "ProcessWalletToBank",
// "ProcessZipitReceive",
// "ProcessP2P",
// "ProcessZipitSend",
// "ViewLinkedBankAccounts",
// "ProcessCashIn",
//  "LinkCard"

export class SmileWalletService {
  private readonly baseUrl: string;
  private readonly apiKey: string;

  constructor() {
    this.baseUrl =
      process.env.SMILEWALLET_API_URL ||
      'https://zbnet.zb.co.zw/wallet_sandbox_api';
    this.apiKey = process.env.SMILEWALLET_API_KEY || '';
  }

  private getHeaders() {
    return {
      'x-api-key': `${this.apiKey}`,
      'Content-Type': 'application/json',
    };
  }
  // authenticate user
  async authenticateUser(phone_number: string, password: string): Promise<any> {
    try {
      const data = {
        phone_number,
        password,
      };

      const response = await axios.post(
        `${this.baseUrl}/authentication/api/v1/auth/authenticate`,
        data,
        {
          headers: { 'Content-Type': 'application/json' },
          maxBodyLength: Infinity,
        },
      );
      return response.data;
    } catch (error) {
      console.error('Error authenticating user:', error);
      throw error;
    }
  }
  // set password
  async setPassword(
    phone_number: string,
    password: string,
    otp: string,
  ): Promise<any> {
    try {
      const data = {
        phone_number,
        password,
        otp,
      };

      const response = await axios.post(
        `${this.baseUrl}/authentication/api/v1/auth/set-password`,
        data,
        {
          headers: { 'Content-Type': 'application/json' },
          maxBodyLength: Infinity,
        },
      );
      return response.data;
    } catch (error) {
      console.error('Error setting password:', error);
      throw error;
    }
  }

  // resend OTP
  async resendOtp(mobile: string): Promise<any> {
    try {
      const response = await axios.get(
        `${this.baseUrl}/authentication/api/v1/auth/otp/resend/${mobile}`,
        {
          headers: this.getHeaders(),
          maxBodyLength: Infinity,
        },
      );
      return response.data;
    } catch (error) {
      console.error('Error resending OTP:', error);
      throw error;
    }
  }

  // create subscriber
  async createSubscriber(data: CreateSubscriberRequest): Promise<any> {
    try {
      console.log('Creating subscriber in Smile Wallet', data);

      const response = await axios.post(
        `${this.baseUrl}/accounts/api/v1/subscribers/create`,
        data,
        { headers: this.getHeaders() },
      );
      if (response.statusText !== 'OK') {
        console.error('Error creating subscriber:', response.statusText);
        return null;
      } else {
        console.log('Subscriber created successfully:', response.data);
        return true;
      }
    } catch (error) {
      console.error('Error creating subscriber:', error);
      return null;
    }
  }
  // get logged-in transactor
  async getLoggedInTransactor(): Promise<any> {
    try {
      const response = await axios.get(
        `${this.baseUrl}/accounts/api/v1/accounts/logged-in-transactor`,
        { headers: this.getHeaders() },
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching logged-in transactor:', error);
      throw error;
    }
  }

  // block transactor
  async blockTransactor(transactorId: string): Promise<any> {
    try {
      const response = await axios.put(
        `${this.baseUrl}/accounts/api/v1/accounts/block-transactor/${transactorId}`,
        {},
        { headers: this.getHeaders(), maxBodyLength: Infinity },
      );
      return response.data;
    } catch (error) {
      console.error('Error blocking transactor:', error);
      throw error;
    }
  }

  // unblock transactor
  async unblockTransactor(transactorId: string): Promise<any> {
    try {
      const response = await axios.put(
        `${this.baseUrl}/accounts/api/v1/accounts/unblock_transactor/${transactorId}`,
        {},
        { headers: this.getHeaders(), maxBodyLength: Infinity },
      );
      return response.data;
    } catch (error) {
      console.error('Error unblocking transactor:', error);
      throw error;
    }
  }

  // balance enquiry
  async balanceEnquiry(
    transactorMobile: string,
    currency: string,
    channel: string,
    transactionId: string,
    requestType: string,
  ): Promise<any> {
    try {
      const data = {
        transactorMobile,
        currency,
        channel,
        transactionId,
      };

      const response = await axios.post(
        `${this.baseUrl}/transactions/subscriber/balance-enquiry/${requestType}`,
        data,
        {
          headers: this.getHeaders(),
          maxBodyLength: Infinity,
        },
      );
      return response.data;
    } catch (error) {
      console.error('Error performing balance enquiry:', error);
      throw error;
    }
  }

  // bank to wallet transfer
  async bankToWalletTransfer(
    phoneNumber: string,
    amount: string,
    currency: string,
    channel: string,
    bankAccount: string,
    narration: string,
    requestType: string,
  ): Promise<any> {
    try {
      const data = {
        phoneNumber,
        amount,
        currency,
        channel,
        bankAccount,
        narration,
      };

      const response = await axios.post(
        `${this.baseUrl}/transactions/subscriber/bank-to-wallet/${requestType}`,
        data,
        {
          headers: this.getHeaders(),
          maxBodyLength: Infinity,
        },
      );
      return response.data;
    } catch (error) {
      console.error('Error performing bank to wallet transfer:', error);
      throw error;
    }
  }

  // peer to peer transfer
  async p2pTransfer(
    receiverMobile: string,
    senderPhone: string,
    amount: string,
    currency: string,
    channel: string,
    narration: string,
    transactionId: string,
    requestType: string,
  ): Promise<any> {
    try {
      const data = {
        receiverMobile,
        senderPhone,
        amount,
        currency,
        channel,
        narration,
        transactionId,
      };

      const response = await axios.post(
        `${this.baseUrl}/transactions/subscriber/p2p-transfer/${requestType}`,
        data,
        {
          headers: this.getHeaders(),
          maxBodyLength: Infinity,
        },
      );
      return response.data;
    } catch (error) {
      console.error('Error performing P2P transfer:', error);
      throw error;
    }
  }

  // link account to mobile
  async linkAccountToMobile(
    accountNumber: string,
    mobile: string,
  ): Promise<any> {
    try {
      const data = {
        accountNumber,
        mobile,
      };

      const response = await axios.post(
        `${this.baseUrl}/accounts/api/v1/self/linking`,
        data,
        {
          headers: this.getHeaders(),
          maxBodyLength: Infinity,
        },
      );
      return response.data;
    } catch (error) {
      console.error('Error linking account to mobile:', error);
      throw error;
    }
  }

  // find linked bank accounts by mobile
  async findLinkedAccountsByMobile(mobile: string): Promise<any> {
    try {
      const response = await axios.get(
        `${this.baseUrl}/accounts/api/v1/bank-accounts/find-linked-accounts-by-mobile/${mobile}`,
        {
          headers: this.getHeaders(),
          maxBodyLength: Infinity,
        },
      );
      return response.data;
    } catch (error) {
      console.error('Error finding linked accounts by mobile:', error);
      throw error;
    }
  }
}
