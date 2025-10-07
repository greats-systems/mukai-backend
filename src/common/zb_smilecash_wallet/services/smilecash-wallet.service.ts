/* eslint-disable @typescript-eslint/no-unsafe-function-type */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import axios from 'axios';
// import {
//   TransactionError,
//   CreateWalletError,
//   LoginError,
// } from './smilecash-wallet.errors';
import {
  LoginResponse,
  SetPasswordResponse,
} from '../responses/registration_and_auth.responses';
import {
  InsufficientFundsResponse,
  TransactionResponseAuth,
  TransactionResponsePayment,
} from '../responses/transactions.responses';
import {
  BalanceEnquiryRequest,
  BankToOtherWalletTransferRequest,
  BankToWalletTransferRequest,
  CashOutRequest,
  PayMerchantRequest,
  WalletToOtherBankTransferRequest,
  WalletToOwnBankTransferRequest,
  WalletToWalletTransferRequest,
} from '../requests/transactions.requests';
import {
  CreateWalletRequest,
  LoginRequest,
  SetPasswordRequest,
} from '../requests/registration_and_auth.requests';
import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { SuccessResponseDto } from '../../dto/success-response.dto';
import {
  CreateWalletError,
  LoginError,
  TransactionError,
} from '../errors/smilecash-wallet.errors';
import { plainToInstance } from 'class-transformer';
import { GeneralErrorResponseDto } from 'src/common/dto/general-error-response.dto';
import { PostgresRest } from 'src/common/postgresrest';
import { MunicipalityBillRequest } from '../requests/municipality-bill.request';

function initLogger(funcname: Function): Logger {
  return new Logger(funcname.name);
}

// Types
@Injectable()
export class SmileCashWalletService {
  private readonly baseUrl: string;
  private readonly apiKey: string;
  private readonly logger = initLogger(SmileCashWalletService);

  constructor(private readonly postgresrest: PostgresRest) {
    this.baseUrl = process.env.SMILECASH_WALLET_BASE_URL || '';
    this.apiKey = process.env.SMILECASH_WALLET_API_KEY || '';
  }

  private getHeaders() {
    return {
      Authorization: `Bearer ${this.apiKey}`,
      'Content-Type': 'application/json',
    };
  }

  private getTransactionHeaders() {
    return {
      'x-api-key': this.apiKey,
      'Content-Type': 'application/json',
    };
  }

  private isLoginError(response: any): response is LoginError {
    return response?.status === 'CONFLICT';
  }

  parseTransactionDescription(response) {
    const result = JSON.parse(JSON.stringify(response));
    // console.debug('Parsing transaction description:', result);
    const description = result.data.transactionStateDescription;

    if (description) {
      const lines = description
        .split('\n')
        .map((line) => line.trim())
        .filter((line) => line.length > 0);

      const parsedDetails = {
        status: lines[0],
        details: {},
      };
      // console.debug('Parsed details:', parsedDetails);

      // Helper function to extract numerical value
      const extractNumber = (str) => {
        const match = str.match(/(\d+\.?\d*)/);
        return match ? parseFloat(match[1]) : null;
      };

      for (let i = 1; i < lines.length; i++) {
        const [key, ...valueParts] = lines[i].split(':');
        if (key && valueParts.length) {
          const value = valueParts.join(':').trim();

          // Special handling for Amount and Balance
          if (key.trim() === 'Amount' || key.trim() === 'Balance') {
            parsedDetails.details[key.trim()] = extractNumber(value);
            parsedDetails.details[`${key.trim()}Raw`] = value; // Keep original
          } else {
            parsedDetails.details[key.trim()] = value;
          }
        }
      }

      result.data.parsedDetails = parsedDetails;
    }

    return result;
  }

  // private isLoginSuccess(response: any): response is LoginResponse {}

  // private isTransactionError(response: any): response is TransactionError {
  //   return response?.responseCode === '400';
  // }

  // private isInsufficientFunds(
  //   response: any,
  // ): response is InsufficientFundsResponse {
  //   return response?.responseCode === '405';
  // }

  // private isCheckingAccountNotFound(
  //   response: any,
  // ): response is CheckingAccountNotFoundResponse {
  //   return response?.responseCode === '304';
  // }

  async createWallet(
    request: CreateWalletRequest,
  ): Promise<SuccessResponseDto | GeneralErrorResponseDto> {
    try {
      this.logger.debug('Creating wallet', request);

      const response = await axios.post(
        `${this.baseUrl}/accounts/api/v1/subscribers/create`,
        request, // Let axios handle JSON serialization
        // { headers: this.getHeaders() },
      );
      if (response.data) {
        this.logger.debug(
          'Create wallet response:',
          JSON.stringify(response.status),
        );
        const error = plainToInstance(CreateWalletError, response.data.data);
        this.logger.error(`Wallet creation failed: ${JSON.stringify(error)}`);
        if (error.message == 'Mobile already taken') {
          return new GeneralErrorResponseDto(
            HttpStatus.CONFLICT,
            'Mobile number already taken',
            error,
          );
        }
        return new GeneralErrorResponseDto(
          HttpStatus.BAD_REQUEST,
          'Wallet creation failed',
          error,
        );
      }

      // Successful response returns null as per your type signature
      return new SuccessResponseDto(
        HttpStatus.CREATED,
        'Wallet created successfully',
        request,
      );
    } catch (error) {
      this.logger.error('createWallet error:', JSON.stringify(error));
      if (error.status == 409) {
        return new GeneralErrorResponseDto(
          HttpStatus.CONFLICT,
          'Mobile number already taken',
          error,
        );
      }
      return new GeneralErrorResponseDto(
        HttpStatus.INTERNAL_SERVER_ERROR,
        'createWallet error',
        error,
      );
    }
  }

  async login(
    request: LoginRequest,
  ): Promise<SuccessResponseDto | GeneralErrorResponseDto> {
    try {
      this.logger.log('Logging in');
      console.debug(request);

      const response = await axios.post(
        `${this.baseUrl}/authentication/api/v1/auth/authenticate`,
        request,
        { headers: this.getHeaders() },
      );
      if (this.isLoginError(response.data)) {
        this.logger.error(`Login failed: ${JSON.stringify(response.data)}`);
        return new GeneralErrorResponseDto(
          HttpStatus.UNAUTHORIZED,
          'Login failed',
          response.data,
        );
      }
      const success = plainToInstance(LoginResponse, response.data);
      return new SuccessResponseDto(HttpStatus.OK, 'Login successful', success);
    } catch (error) {
      this.logger.error(`Login error: ${error}`);
      return {
        statusCode: 500,
        message: error,
      };
    }
  }

  async setPassword(
    request: SetPasswordRequest,
  ): Promise<SuccessResponseDto | GeneralErrorResponseDto> {
    try {
      console.debug('Setting password');
      const response = await axios.post(
        `${this.baseUrl}/authentication/api/v1/auth/set-password`,
        request,
        { headers: this.getHeaders() },
      );
      // const success = response.data as SetPasswordResponse;
      return new SuccessResponseDto(
        HttpStatus.OK,
        'Password set successfully',
        response.data as SetPasswordResponse,
      );
    } catch (error) {
      this.logger.error(`setPassword error: ${error}`);
      return {
        statusCode: 500,
        message: error,
      };
    }
  }

  /*
  async linkBankAccount(
    request: LinkBankAccountRequest,
  ): Promise<LinkBankAccountResponse> {}
  */

  async balanceEnquiry(
    request: BalanceEnquiryRequest,
  ): Promise<SuccessResponseDto | GeneralErrorResponseDto> {
    this.logger.log(
      `Initiating balance enquiry for ${request.transactorMobile}`,
    );
    try {
      // Auth request
      const authResponse = await axios.post(
        `${this.baseUrl}/transactions/subscriber/balance-enquiry/auth`,
        request,
        { headers: this.getTransactionHeaders() },
      );

      // Check for transaction error
      const authError = plainToInstance(TransactionError, authResponse.data);
      if (authError?.responseCode === '304') {
        // Assuming '304' is your error code
        console.debug(`Balance enquiry auth error:`, authError);
        return new GeneralErrorResponseDto(
          HttpStatus.BAD_REQUEST,
          'Failed to authorize balance enquiry',
          authError,
        );
      }

      // Check for insufficient funds
      const insufficientFunds = plainToInstance(
        InsufficientFundsResponse,
        authResponse.data,
      );
      if (insufficientFunds?.responseCode === '405') {
        // Assuming '405' is your code
        return new GeneralErrorResponseDto(
          HttpStatus.METHOD_NOT_ALLOWED,
          'Insufficient funds',
          insufficientFunds,
        );
      }

      // Process successful auth
      const authData = plainToInstance(
        TransactionResponseAuth,
        authResponse.data,
      );
      if (!authData?.data?.authResponse?.transactionId) {
        return new GeneralErrorResponseDto(
          HttpStatus.INTERNAL_SERVER_ERROR,
          'Invalid auth response structure',
          authResponse.data,
        );
      }

      request.transactionId = authData.data.authResponse.transactionId;
      request.sendSMS = false;

      // Payment request
      const payResponse = await axios.post(
        `${this.baseUrl}/transactions/subscriber/balance-enquiry/payment`,
        request,
        { headers: this.getTransactionHeaders() },
      );

      // Check for payment error
      const paymentError = plainToInstance(TransactionError, payResponse.data);
      if (paymentError?.responseCode === '400') {
        console.debug(`Balance enquiry payment error:`, paymentError);
        return new GeneralErrorResponseDto(
          HttpStatus.BAD_REQUEST,
          'Failed to process balance enquiry',
          paymentError,
        );
      }

      // Return successful response
      const paymentData = plainToInstance(
        TransactionResponsePayment,
        payResponse.data,
      );
      // console.debug(`Balance enquiry successful:`, paymentData);
      if (!paymentData?.data) {
        return new GeneralErrorResponseDto(
          HttpStatus.INTERNAL_SERVER_ERROR,
          'Invalid payment response structure',
          paymentData,
        );
      }
      const formattedResponse = this.parseTransactionDescription(paymentData);
      // console.debug(`Formatted response:`, formattedResponse);
      return new SuccessResponseDto(
        HttpStatus.OK,
        'Balance enquiry successful',
        formattedResponse,
      );
    } catch (error) {
      this.logger.error(`Balance enquiry error:`, error);
      return new GeneralErrorResponseDto(
        HttpStatus.INTERNAL_SERVER_ERROR,
        'Balance enquiry failed',
        error,
      );
    }
  }

  async bankToWallet(
    request: BankToWalletTransferRequest,
  ): Promise<SuccessResponseDto | GeneralErrorResponseDto> {
    try {
      // Always start with an auth request
      const authResponse = await axios.post(
        `${this.baseUrl}/transactions/subscriber/bank-to-wallet/auth`,
        request,
        { headers: this.getTransactionHeaders() },
      );
      const authError = plainToInstance(TransactionError, authResponse.data);
      if (authError?.responseCode === '304') {
        console.debug(
          `bankToWallet auth error: ${JSON.stringify(authResponse.data)}`,
        );
        return new GeneralErrorResponseDto(
          HttpStatus.BAD_REQUEST,
          'Failed to authorize bank to wallet transfer',
          authResponse.data,
        );
      }

      const insufficientFunds = plainToInstance(
        InsufficientFundsResponse,
        authResponse.data,
      );

      if (insufficientFunds?.responseCode === '916') {
        // Assuming '916' is your code
        return new GeneralErrorResponseDto(
          HttpStatus.METHOD_NOT_ALLOWED,
          'Insufficient funds',
          authResponse.data,
        );
      }

      // Then call the payment request
      const authData = plainToInstance(
        TransactionResponseAuth,
        authResponse.data,
      );
      request.transactionId = authData.data.authResponse.transactionId;
      const payResponse = await axios.post(
        `${this.baseUrl}/transactions/subscriber/bank-to-wallet/payment`,
        request,
        { headers: this.getTransactionHeaders() },
      );
      const payError = plainToInstance(TransactionError, payResponse.data);
      if (payError?.responseCode === '304') {
        console.debug(
          `bankToWallet payment error: ${JSON.stringify(payResponse.data)}`,
        );
        return new GeneralErrorResponseDto(
          HttpStatus.BAD_REQUEST,
          'Failed to process bank to wallet transaction',
          payResponse.data,
        );
      }
      const paymentData = plainToInstance(
        TransactionResponsePayment,
        payResponse.data,
      );
      return new SuccessResponseDto(
        HttpStatus.OK,
        'Bank to wallet successful',
        paymentData,
      );
    } catch (error) {
      this.logger.error(`bankToWallet error: ${error}`);
      return new GeneralErrorResponseDto(
        HttpStatus.INTERNAL_SERVER_ERROR,
        'bankToWallet error',
        error,
      );
    }
  }

  async walletToWallet(
    request: WalletToWalletTransferRequest,
  ): Promise<SuccessResponseDto | GeneralErrorResponseDto> {
    try {
      this.logger.debug(`Base URL: ${this.baseUrl}`);
      // Always start with an auth request
      request.channel = 'USSD';
      request.currency = request.currency.toUpperCase();
      console.debug('Starting walletToWallet transfer', request);
      const authResponse = await axios.post(
        `${this.baseUrl}/transactions/subscriber/p2p-transfer/auth`,
        request,
        { headers: this.getTransactionHeaders() },
      );
      const authError = plainToInstance(TransactionError, authResponse.data);
      console.debug('Auth response:', authResponse.data);
      if (authError?.responseCode === '304') {
        console.debug(
          `walletToWallet auth error: ${JSON.stringify(authResponse.data)}`,
        );
        return new GeneralErrorResponseDto(
          HttpStatus.BAD_REQUEST,
          'Failed to authorize wallet to wallet transfer',
          authResponse.data,
        );
      }
      const insufficientFunds = plainToInstance(
        InsufficientFundsResponse,
        authResponse.data,
      );
      if (insufficientFunds?.responseCode === '916') {
        console.debug(authResponse.data);
        return new GeneralErrorResponseDto(
          HttpStatus.METHOD_NOT_ALLOWED,
          'Insufficient funds',
          authResponse.data,
        );
      }
      console.debug('Auth successful, proceeding to payment');
      // Then call the payment request
      const authData = plainToInstance(
        TransactionResponseAuth,
        authResponse.data,
      );
      console.debug(`Transaction ID: ${authData.data.id}`);
      request.transactionId =
        authData.data.id || authData.data.authResponse.transactionId;
      const payResponse = await axios.post(
        `${this.baseUrl}/transactions/subscriber/p2p-transfer/payment`,
        request,
        { headers: this.getTransactionHeaders() },
      );
      const payError = plainToInstance(TransactionError, payResponse.data);
      // console.debug('Payment response:', payResponse.data);
      if (payError?.responseCode === '304') {
        console.debug(
          `walletToWallet payment error: ${JSON.stringify(payResponse.data)}`,
        );
        return new GeneralErrorResponseDto(
          HttpStatus.BAD_REQUEST,
          'Failed to process wallet to wallet transfer',
          payResponse.data,
        );
      }
      if (payError?.responseCode === '842') {
        console.debug(
          `walletToWallet payment error: ${JSON.stringify(payResponse.data)}`,
        );
        return new GeneralErrorResponseDto(
          HttpStatus.NOT_ACCEPTABLE,
          'Failed to process wallet to wallet transfer',
          payResponse.data,
        );
      }
      const paymentData = plainToInstance(
        TransactionResponsePayment,
        payResponse.data,
      );
      const loggedResponse = this.parseTransactionDescription(paymentData);
      console.debug(
        'Parsed transaction description:',
        JSON.stringify(loggedResponse.data.parsedDetails),
      );

      await this.postgresrest.from('transaction_logs').insert({
        response_code: loggedResponse.responseCode,
        response_description: loggedResponse.responseDescription,
        transaction_id: loggedResponse.data.id,
        reference: loggedResponse.data.reference,
        currency: loggedResponse.data.currency,
        product: loggedResponse.data.product,
        amount: loggedResponse.data.amount,
        transactor_id: loggedResponse.data.transactorId,
        transactor_name: loggedResponse.data.transactorName,
        source: loggedResponse.data.source,
        destination: loggedResponse.data.destination,
        transaction_date: loggedResponse.data.transactionDate,
        channel: loggedResponse.data.channel,
        description: loggedResponse.data.description,
        transaction_status: loggedResponse.data.transactionStatus,
        type_of_transaction: loggedResponse.data.typeOfTransaction,
        auth_response: loggedResponse.data.authResponse,
        biller_response: loggedResponse.data.billerResponse,
        additional_data: loggedResponse.data.additionalData,
        transaction_state_description:
          loggedResponse.data.transactionStateDescription,
        date: loggedResponse.data.parsedDetails.details.Date,
        balance: loggedResponse.data.parsedDetails.details.Balance,
      });

      // console.debug('Database response:', dbResponse);
      return new SuccessResponseDto(
        HttpStatus.OK,
        'wallet to wallet transfer successful',
        paymentData,
      );
    } catch (error) {
      this.logger.error(`walletToWallet error: ${error}`);
      return new GeneralErrorResponseDto(
        HttpStatus.INTERNAL_SERVER_ERROR,
        'walletToWallet error',
        error.response?.toString() || error,
      );
    }
  }

  async walletToOwnBank(
    request: WalletToOwnBankTransferRequest,
  ): Promise<SuccessResponseDto | GeneralErrorResponseDto> {
    try {
      // Always start with an auth request
      const authResponse = await axios.post(
        `${this.baseUrl}/transactions/subscriber/wallet-to-bank/auth`,
        request,
        { headers: this.getTransactionHeaders() },
      );
      const authError = plainToInstance(TransactionError, authResponse.data);
      console.debug('Auth response:', authResponse.data);
      if (
        authError?.responseCode === '304' ||
        authError?.responseCode === '842'
      ) {
        console.debug(
          `walletToOwnBank auth error: ${JSON.stringify(authResponse.data)}`,
        );
        return new GeneralErrorResponseDto(
          HttpStatus.BAD_REQUEST,
          'Failed to authorize wallet to own bank transfer',
          authResponse.data,
        );
      }

      const insufficientFunds = plainToInstance(
        InsufficientFundsResponse,
        authResponse.data,
      );

      if (insufficientFunds?.responseCode === '916') {
        console.debug(authResponse.data);
        return new GeneralErrorResponseDto(
          HttpStatus.METHOD_NOT_ALLOWED,
          'Insufficient funds',
          authResponse.data,
        );
      }

      // Then call the payment request
      const authData = authResponse.data as TransactionResponseAuth;
      this.logger.debug(`${JSON.stringify(authData.data.id)}`);
      request.transactionId = authData.data.id;
      const payResponse = await axios.post(
        `${this.baseUrl}/transactions/subscriber/wallet-to-bank/payment`,
        request,
        { headers: this.getTransactionHeaders() },
      );
      const payError = plainToInstance(TransactionError, payResponse.data);
      console.debug('Payment response:', payResponse.data);
      if (payError?.responseCode === '304') {
        console.debug(
          `walletToOwnBank payment error: ${JSON.stringify(payResponse.data)}`,
        );
        return new GeneralErrorResponseDto(
          HttpStatus.BAD_REQUEST,
          'Failed to process wallet to bank transfer',
          payResponse.data,
        );
      }
      const paymentData = plainToInstance(
        TransactionResponsePayment,
        payResponse.data,
      );
      return new SuccessResponseDto(
        HttpStatus.OK,
        'Wallet to own bank transaction successsful',
        paymentData,
      );
    } catch (error) {
      this.logger.error(`walletToOwnBank error: ${error}`);
      return new GeneralErrorResponseDto(
        HttpStatus.INTERNAL_SERVER_ERROR,
        'walletToOwnBank error',
        error,
      );
    }
  }

  async walletToOtherBank(
    request: WalletToOtherBankTransferRequest,
  ): Promise<SuccessResponseDto | GeneralErrorResponseDto> {
    try {
      // Always start with an auth request
      const authResponse = await axios.post(
        `${this.baseUrl}/transactions/subscriber/wallet-to-bank-other/auth`,
        request,
        { headers: this.getTransactionHeaders() },
      );
      const authError = plainToInstance(TransactionError, authResponse.data);
      if (authError?.responseCode === '304') {
        console.debug(
          `walletToOtherBank auth error: ${JSON.stringify(authResponse.data)}`,
        );
        return new GeneralErrorResponseDto(
          HttpStatus.BAD_REQUEST,
          'Failed to authorize wallet to other bank transfer',
          authResponse.data,
        );
      }

      const insufficientFunds = plainToInstance(
        InsufficientFundsResponse,
        authResponse.data,
      );

      if (insufficientFunds?.responseCode === '916') {
        console.debug(authResponse.data);
        return new GeneralErrorResponseDto(
          HttpStatus.METHOD_NOT_ALLOWED,
          'Insufficient funds',
          authResponse.data,
        );
      }

      // Then call the payment request
      const authData = plainToInstance(
        TransactionResponseAuth,
        authResponse.data,
      );
      request.transactionId = authData.data.authResponse.transactionId;
      const payResponse = await axios.post(
        `${this.baseUrl}/transactions/subscriber/wallet-to-bank-other/payment`,
        request,
        { headers: this.getTransactionHeaders() },
      );
      const payError = plainToInstance(TransactionError, payResponse.data);
      if (payError?.responseCode === '304') {
        console.debug(
          `walletToOtherBank payment error: ${JSON.stringify(payResponse.data)}`,
        );
        return new GeneralErrorResponseDto(
          HttpStatus.BAD_REQUEST,
          'Failed to process wallet to other bank transfer',
          payResponse.data,
        );
      }
      const paymentData = plainToInstance(
        TransactionResponsePayment,
        payResponse.data,
      );
      return new SuccessResponseDto(
        HttpStatus.OK,
        'Wallet to other bank transaction successsful',
        paymentData,
      );
    } catch (error) {
      this.logger.error(`walletToOtherBank error: ${JSON.stringify(error)}`);
      return new GeneralErrorResponseDto(
        HttpStatus.INTERNAL_SERVER_ERROR,
        'walletToOtherBank error',
        error,
      );
    }
  }

  async payMerchant(
    request: PayMerchantRequest,
  ): Promise<SuccessResponseDto | GeneralErrorResponseDto> {
    try {
      // Always start with an auth request
      const authResponse = await axios.post(
        `${this.baseUrl}/transactions/subscriber/payment/auth`,
        request,
        { headers: this.getTransactionHeaders() },
      );
      if (authResponse.data instanceof TransactionError) {
        console.debug(
          `payMerchant auth error: ${JSON.stringify(authResponse.data)}`,
        );
        return new GeneralErrorResponseDto(
          HttpStatus.BAD_REQUEST,
          'Failed to authorize pay merchant transaction',
          authResponse.data,
        );
      }

      if (authResponse.data instanceof InsufficientFundsResponse) {
        return new GeneralErrorResponseDto(
          HttpStatus.METHOD_NOT_ALLOWED,
          'Insufficient funds',
          authResponse.data,
        );
      }

      // Then call the payment request
      const authData = authResponse.data as TransactionResponseAuth;
      request.transactionId = authData.data.authResponse.transactionId;
      const payResponse = await axios.post(
        `${this.baseUrl}/transactions/subscriber/payment/payment`,
        request,
        { headers: this.getTransactionHeaders() },
      );
      if (payResponse.data instanceof TransactionError) {
        console.debug(`payMerchant payment error: ${authResponse.data}`);
        return new GeneralErrorResponseDto(
          HttpStatus.BAD_REQUEST,
          'Failed to process pay merchant transaction',
          payResponse.data,
        );
      }
      return new SuccessResponseDto(
        HttpStatus.OK,
        'Pay merchant transaction successful',
        payResponse.data as TransactionResponsePayment,
      );
    } catch (error) {
      this.logger.error(`payMerchant error: ${error}`);
      return new GeneralErrorResponseDto(
        HttpStatus.INTERNAL_SERVER_ERROR,
        'payMerchant error',
        error,
      );
    }
  }

  async cashOut(
    request: CashOutRequest,
  ): Promise<SuccessResponseDto | GeneralErrorResponseDto> {
    try {
      // Always start with an auth request
      const authResponse = await axios.post(
        `${this.baseUrl}/transactions/subscriber/cash-out/auth`,
        request,
        { headers: this.getTransactionHeaders() },
      );
      if (authResponse.data instanceof TransactionError) {
        console.debug(
          `cashOut auth error: ${JSON.stringify(authResponse.data)}`,
        );
        return new GeneralErrorResponseDto(
          HttpStatus.BAD_REQUEST,
          'Failed to authorize cash out transaction',
          authResponse.data,
        );
      }

      if (authResponse.data instanceof InsufficientFundsResponse) {
        return new GeneralErrorResponseDto(
          HttpStatus.METHOD_NOT_ALLOWED,
          'Insufficient funds',
          authResponse.data,
        );
      }

      // Then call the payment request
      const authData = authResponse.data as TransactionResponseAuth;
      request.transactionId = authData.data.authResponse.transactionId;
      const payResponse = await axios.post(
        `${this.baseUrl}/transactions/subscriber/cash-out/payment`,
        request,
        { headers: this.getTransactionHeaders() },
      );
      if (payResponse.data instanceof TransactionError) {
        console.debug(`cashOut payment error: ${authResponse.data}`);
        return new GeneralErrorResponseDto(
          HttpStatus.BAD_REQUEST,
          'Failed to process cash out transaction',
          payResponse.data,
        );
      }
      return new SuccessResponseDto(
        HttpStatus.OK,
        'Cash out transaction successful',
        payResponse.data as TransactionResponsePayment,
      );
    } catch (error) {
      this.logger.error(`cashOut error: ${error}`);
      return new GeneralErrorResponseDto(
        HttpStatus.INTERNAL_SERVER_ERROR,
        'cashOut error',
        error,
      );
    }
  }

  async bankToOtherWallet(
    request: BankToOtherWalletTransferRequest,
  ): Promise<SuccessResponseDto | GeneralErrorResponseDto> {
    try {
      // Always start with an auth request
      const authResponse = await axios.post(
        `${this.baseUrl}/transactions/subscriber/bank-to-wallet/auth`,
        request,
        { headers: this.getTransactionHeaders() },
      );
      if (authResponse.data instanceof TransactionError) {
        console.debug(
          `bankToOtherWallet auth error: ${JSON.stringify(authResponse.data)}`,
        );
        return new GeneralErrorResponseDto(
          HttpStatus.BAD_REQUEST,
          'Failed to authorize bank to other wallet transaction',
          authResponse.data,
        );
      }

      if (authResponse.data instanceof InsufficientFundsResponse) {
        return new GeneralErrorResponseDto(
          HttpStatus.METHOD_NOT_ALLOWED,
          'Insufficient funds',
          authResponse.data,
        );
      }

      // Then call the payment request
      const authData = authResponse.data as TransactionResponseAuth;
      request.transactionId = authData.data.authResponse.transactionId;
      const payResponse = await axios.post(
        `${this.baseUrl}/transactions/subscriber/bank-to-wallet/payment`,
        request,
        { headers: this.getTransactionHeaders() },
      );
      if (payResponse.data instanceof TransactionError) {
        console.debug(`bankToOtherWallet payment error: ${authResponse.data}`);
        return new GeneralErrorResponseDto(
          HttpStatus.BAD_REQUEST,
          'Failed to process bank to other wallet transaction',
          authResponse.data,
        );
      }
      return new SuccessResponseDto(
        HttpStatus.OK,
        'Bank to other wallet transaction successful',
        payResponse.data as TransactionResponsePayment,
      );
    } catch (error) {
      this.logger.error(`bankToOtherWallet error: ${error}`);
      return {
        statusCode: 500,
        message: error,
      };
    }
  }

  async payMunicipalityBill(
    mbRequest: MunicipalityBillRequest,
  ): Promise<SuccessResponseDto | GeneralErrorResponseDto> {
    try {
      // 1. Transfer customer's US$ funds to agent account (wallet-to-wallet)
      const w2wResponse = await this.walletToWallet(
        mbRequest.w2wTransferRequest,
      );
      if (w2wResponse instanceof GeneralErrorResponseDto) {
        return w2wResponse;
      }

      // 2. Convert US$ funds into ZWG. The incoming request should provide the agent's transactor mobile, and the municipality's
      // destination bank account number
      mbRequest.w2obTransferRequest.bankAccount = '411300074182200';
      mbRequest.w2obTransferRequest.amount =
        mbRequest.w2wTransferRequest.amount * 28;
      mbRequest.w2obTransferRequest.channel = 'USSD';
      mbRequest.w2obTransferRequest.currency = 'ZWG';
      mbRequest.w2obTransferRequest.subscriberMobile = '263780032799';
      const w2obResponse = await this.walletToOwnBank(
        mbRequest.w2obTransferRequest,
      );
      if (w2obResponse instanceof GeneralErrorResponseDto) {
        return w2obResponse;
      }

      // 3. Return a success message
      this.logger.log('Payment successful!');
      return new SuccessResponseDto(
        201,
        'Payment successful!',
        w2obResponse.data,
      );
    } catch (e) {
      this.logger.error(`payMunicipalityBill error: ${e}`);
      return new GeneralErrorResponseDto(500, 'payMunicipalityBill error', e);
    }
  }
}
