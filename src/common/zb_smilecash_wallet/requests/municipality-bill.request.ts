import {
  WalletToOwnBankTransferRequest,
  WalletToWalletTransferRequest,
} from './transactions.requests';

export class MunicipalityBillRequest {
  w2wTransferRequest: WalletToWalletTransferRequest;
  w2obTransferRequest: WalletToOwnBankTransferRequest;
}
