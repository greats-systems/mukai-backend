export interface BalanceEnquiryRequest {
  transactorMobile: string;
  currency: string; // ZWG | USD
  channel: string; //USSD | APP | WEB
  transactionId: string;
}

export interface BankToWalletTransferRequest {
  phoneNumber: string; //WALLET MOBILE
  amount: number;
  currency: string;
  channel: string;
  bankAccount: string; //ZB BANK ACCOUNT
  transactionId: string;
  narration: string | undefined;
}

export interface WalletToWalletTransferRequest {
  receiverMobile: string; //DESTINATION WALLET
  senderPhone: string; //SOURCE WALLET
  amount: number;
  currency: string;
  channel: string;
  narration: string;
  transactionId: string | undefined;
}

export interface WalletToOwnBankTransferRequest {
  subscriberMobile: string;
  bank: string;
  bankAccount: string;
  amount: number;
  currency: string;
  channel: string;
  messageType: string;
  transactionId: string;
}

export interface WalletToOtherBankTransferRequest {
  transactorMobile: string;
  destinationBankAccount: string;
  amount: number;
  currency: string;
  channel: string;
  messageType: string;
  transactionId: string;
}

export interface PayMerchantRequest {
  transactorPhone: string;
  merchantCode: string;
  amount: number;
  currency: string;
  channel: string;
  messageType: string;
  transactionId: string;
  narration: string;
}

export interface CashOutRequest {
  subscriberMobile: string;
  agentPhone: string;
  agentCode: string;
  amount: 0;
  currency: string;
  channel: string;
  transactionId: string;
}

export interface BankToOtherWalletTransferRequest {
  phoneNumber: string;
  destinationWalletAccount: string;
  sourceBankAccount: string;
  amount: number;
  currency: string;
  channel: string;
  transactionId: string;
  narration: string;
}
