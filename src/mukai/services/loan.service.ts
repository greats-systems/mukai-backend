/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-function-type */
import { Logger, Injectable } from '@nestjs/common';
import { ErrorResponseDto } from 'src/common/dto/error-response.dto';
import { PostgresRest } from 'src/common/postgresrest';
import { CreateLoanDto } from '../dto/create/create-loan.dto';
import { UpdateLoanDto } from '../dto/update/update-loan.dto';
import { Loan } from '../entities/loan.entity';
import { DateTime } from 'luxon';
import { v4 as uuidv4 } from 'uuid';
import { GeneralErrorResponseDto } from 'src/common/dto/general-error-response.dto';
import {
  BalanceEnquiryRequest,
  WalletToWalletTransferRequest,
} from 'src/common/zb_smilecash_wallet/requests/transactions.requests';
import { SmileCashWalletService } from 'src/common/zb_smilecash_wallet/services/smilecash-wallet.service';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from '../dto/create/create-transaction.dto';
import { Cron } from '@nestjs/schedule';

function initLogger(funcname: Function): Logger {
  return new Logger(funcname.name);
}

@Injectable()
export class LoanService {
  private readonly logger = initLogger(LoanService);
  constructor(
    private readonly transactionsService: TransactionsService, // ✅ Inject
    private readonly smileCashWalletService: SmileCashWalletService,
    private readonly postgresrest: PostgresRest,
  ) {}

  calculateRepayAmount(principalAmount: number, loanTermMonths: number) {
    const principal = principalAmount ?? 0;
    const months = loanTermMonths ?? 0;

    if (principal <= 0 || months <= 0) {
      // paymentAmount = 0;
      return;
    }

    const monthlyRate = 0.02; // 2% monthly interest
    // monthlyRate**months
    const repayAmount = principal * (1 + monthlyRate) ** months;
    return repayAmount;
  }

  calculateDueDate(months: number): Date {
    if (months <= 0) throw new Error('Term must be positive');

    const today = DateTime.now();
    const dueDate = today.plus({ months: Math.round(months) }); // Handles year rollover automatically

    return dueDate.toJSDate(); // Convert to JavaScript Date if needed
  }
  /*
  @Cron()
  async repayLoan(): Promise<any | GeneralErrorResponseDto> {
    try {
      const today = DateTime.now();
      const loanDto = new CreateLoanDto();
      const loansService = new LoanService(this.postgresrest);
      // 1. Fetch loan data
      const { data, error } = await this.postgresrest
        .from('active_loans')
        .select();
      if (error) {
        this.logger.error('Failed to fetch active loans', error);
        return new GeneralErrorResponseDto(
          400,
          'Failed to fetch active loans',
          error,
        );
      }

      // 2. Loop through each record
      for (const item of data) {
        const loanDate = DateTime.fromISO(item.date_disbursed);
        //  Calculate payment amount
        const paymentAmount =
          item.total_repayment_amount / item.loan_term_months;
        // a. If it's the applicant's 1st repayment
        if (
          today.toFormat('yyyy-MM-dd') ==
            loanDate.plus({ days: 30 }).toFormat('yyyy-MM-dd') &&
          (item.last_payment_date == null ||
            item.last_payment_date.isEmpty ||
            item.last_payment_date)
        ) {
          this.logger.debug(`Deducting 1st payment`);
          // i. Check sender's wallet balance
          const beResponse = await this.checkBalance(
            item.borrower_phone,
            item.currency,
          );
          if (beResponse instanceof GeneralErrorResponseDto) {
            return beResponse;
          }
          // ii. Check if balance is sufficient to complete the transaction
          if (beResponse < paymentAmount) {
            return new GeneralErrorResponseDto(
              403,
              'Insufficient balance for loan repayment',
            );
          }
          // iii. Deduct the money
          const dmResponse = await this.deductMoney(
            item.lender_phone,
            item.borrower_phone,
            paymentAmount,
            item.currency,
          );
          if (dmResponse instanceof GeneralErrorResponseDto) {
            return dmResponse;
          }

          // iv. Record the transaction
          const transService = new TransactionsService(this.postgresrest);
          const tranDto = new CreateTransactionDto();
          tranDto.transaction_type = 'loan repayment';
          tranDto.narrative = 'debit';
          tranDto.sending_wallet = item.borrower_wallet_id;
          tranDto.receiving_wallet = item.lender_wallet_id;
          tranDto.amount = paymentAmount;
          tranDto.transfer_mode = 'WALLETPLUS';
          const transResponse = await transService.createTransaction(tranDto);
          if (transResponse instanceof ErrorResponseDto) {
            return transResponse;
          }

          // v. Insert the new loan record
          loanDto.status = item.status;
          loanDto.last_payment_date = today.toString();
          loanDto.next_payment_date = today.plus({ days: 30 }).toString();
          loanDto.payment_amount = paymentAmount;
          loanDto.currency = item.currency;
          loanDto.borrower_wallet_id = item.borrower_wallet_id;
          loanDto.lender_wallet_id = item.lender_wallet_id;
          loanDto.collateral_description = item.collateral_description;
          loanDto.due_date = item.due_date;
          loanDto.remaining_balance = item.remaining_balance - paymentAmount;
          loanDto.interest_rate = item.interest_rate;
          const loanResponse = await loansService.createLoan(loanDto);
          if (loanResponse instanceof ErrorResponseDto) {
            return loanResponse;
          }
        }
        // b. If it's the applicant's 2nd, 3rd,...,(n-1)th payment
        else if (
          today.toFormat('yyyy-MM-dd') ==
          DateTime.fromISO(item.last_payment_date)
            .plus({ days: 30 })
            .toFormat('yyyy-MM-dd')
        ) {
          this.logger.debug(`Deducting next payment`);
          // i. Check sender's wallet balance
          const beResponse = await this.checkBalance(
            item.borrower_phone,
            item.currency,
          );
          if (beResponse instanceof GeneralErrorResponseDto) {
            return beResponse;
          }
          // ii. Check if balance is sufficient to complete the transaction
          if (beResponse < paymentAmount) {
            return new GeneralErrorResponseDto(
              403,
              'Insufficient balance for loan repayment',
            );
          }
          // iii. Deduct the money
          const dmResponse = await this.deductMoney(
            item.lender_phone,
            item.borrower_phone,
            paymentAmount,
            item.currency,
          );
          if (dmResponse instanceof GeneralErrorResponseDto) {
            return dmResponse;
          }

          // iv. Record the transaction
          const transService = new TransactionsService(this.postgresrest);
          const tranDto = new CreateTransactionDto();
          tranDto.transaction_type = 'loan repayment';
          tranDto.narrative = 'debit';
          tranDto.sending_wallet = item.borrower_wallet_id;
          tranDto.receiving_wallet = item.lender_wallet_id;
          tranDto.amount = paymentAmount;
          tranDto.transfer_mode = 'WALLETPLUS';
          const transResponse = await transService.createTransaction(tranDto);
          if (transResponse instanceof ErrorResponseDto) {
            return transResponse;
          }

          // v. Insert the new loan record
          loanDto.status = item.status;
          loanDto.last_payment_date = today.toString();
          loanDto.next_payment_date = today.plus({ days: 30 }).toString();
          loanDto.payment_amount = paymentAmount;
          loanDto.currency = item.currency;
          loanDto.borrower_wallet_id = item.borrower_wallet_id;
          loanDto.lender_wallet_id = item.lender_wallet_id;
          loanDto.collateral_description = item.collateral_description;
          loanDto.due_date = item.due_date;
          loanDto.remaining_balance = item.remaining_balance - paymentAmount;
          loanDto.interest_rate = item.interest_rate;
          const loanResponse = await loansService.createLoan(loanDto);
          if (loanResponse instanceof ErrorResponseDto) {
            return loanResponse;
          }
        }
        // c. If it's the applicant's last payment
        else if (
          today.toFormat('yyyy-MM-dd') ==
          DateTime.fromISO(item.due_date).toFormat('yyyy-MM-dd')
        ) {
          this.logger.debug(`Deducting final payment`);
          // i. Check sender's wallet balance
          const beResponse = await this.checkBalance(
            item.borrower_phone,
            item.currency,
          );
          if (beResponse instanceof GeneralErrorResponseDto) {
            return beResponse;
          }
          // ii. Check if balance is sufficient to complete the transaction
          if (beResponse < paymentAmount) {
            return new GeneralErrorResponseDto(
              403,
              'Insufficient balance for loan repayment',
            );
          }
          // iii. Deduct the money
          const dmResponse = await this.deductMoney(
            item.lender_phone,
            item.borrower_phone,
            paymentAmount,
            item.currency,
          );
          if (dmResponse instanceof GeneralErrorResponseDto) {
            return dmResponse;
          }

          // iv. Record the transaction
          const transService = new TransactionsService(this.postgresrest);
          const tranDto = new CreateTransactionDto();
          tranDto.transaction_type = 'loan repayment';
          tranDto.narrative = 'debit';
          tranDto.sending_wallet = item.borrower_wallet_id;
          tranDto.receiving_wallet = item.lender_wallet_id;
          tranDto.amount = paymentAmount;
          tranDto.transfer_mode = 'WALLETPLUS';
          const transResponse = await transService.createTransaction(tranDto);
          if (transResponse instanceof ErrorResponseDto) {
            return transResponse;
          }

          // v. Insert the new loan record (add status of 'paid')
          loanDto.status = 'paid';
          loanDto.last_payment_date = today.toString();
          loanDto.next_payment_date = today.plus({ days: 30 }).toString();
          loanDto.payment_amount = paymentAmount;
          loanDto.currency = item.currency;
          loanDto.borrower_wallet_id = item.borrower_wallet_id;
          loanDto.lender_wallet_id = item.lender_wallet_id;
          loanDto.collateral_description = item.collateral_description;
          loanDto.due_date = item.due_date;
          loanDto.remaining_balance = item.remaining_balance - paymentAmount;
          loanDto.interest_rate = item.interest_rate;
          const loanResponse = await loansService.createLoan(loanDto);
          if (loanResponse instanceof ErrorResponseDto) {
            return loanResponse;
          }
        } else {
          this.logger.debug('Nothing to process');
          return;
        }
      }
    } catch (error) {
      this.logger.error(`repayLoan error: ${JSON.stringify(error)}`);
      return new GeneralErrorResponseDto(500, 'repayLoan error', error);
    }
  }
  */
  @Cron('1 * * * * *')
  handleCron() {
    this.logger.debug('Calling cron job');
  }
  // async repayLoan(): Promise<any | GeneralErrorResponseDto> {
  //   try {
  //     const today = DateTime.now();
  //     /*
  //     const loanDto = new CreateLoanDto();
  //     const loansService = new LoanService(this.postgresrest);
  //     */
  //     // 1. Fetch loan data
  //     const { data, error } = await this.postgresrest
  //       .from('active_loans')
  //       .select();
  //     if (error) {
  //       this.logger.error('Failed to fetch active loans', error);
  //       return new GeneralErrorResponseDto(
  //         400,
  //         'Failed to fetch active loans',
  //         error,
  //       );
  //     }

  //     // 2. Loop through all records
  //     for (const item of data) {
  //       /*
  //       const firstPayDay = DateTime.fromISO(item.date_disbursed).plus({
  //         days: 30,
  //       });

  //       let nextPayDay;
  //       if (item.last_payment_date != null) {
  //         nextPayDay = DateTime.fromISO(item.last_payment_date).plus({
  //           days: 30,
  //         });
  //       }
  //       */
  //       const finalPayDay = DateTime.fromISO(item.due_date);

  //       if (
  //         today.toFormat('yyyy-MM-dd') != finalPayDay.toFormat('yyyy-MM-dd')
  //       ) {
  //         // Handle 1st, 2nd, 3rd, ..., (n-1)th payment
  //         const processRepaymentResponse = await this.processRepayment(
  //           item,
  //           'repaying',
  //         );
  //         if (
  //           processRepaymentResponse instanceof GeneralErrorResponseDto ||
  //           processRepaymentResponse instanceof ErrorResponseDto
  //         ) {
  //           return processRepaymentResponse;
  //         }
  //       } else {
  //         // Handle final (nth) payment
  //         const processRepaymentResponse = await this.processRepayment(
  //           item,
  //           'paid',
  //         );
  //         if (
  //           processRepaymentResponse instanceof GeneralErrorResponseDto ||
  //           processRepaymentResponse instanceof ErrorResponseDto
  //         ) {
  //           return processRepaymentResponse;
  //         }
  //       }
  //     }
  //   } catch (error) {
  //     this.logger.error(`repayLoan error: ${JSON.stringify(error)}`);
  //     return new GeneralErrorResponseDto(500, 'repayLoan error', error);
  //   }
  // }

  private async processRepayment(
    item: any,
    loanStatus: string,
  ): Promise<boolean | GeneralErrorResponseDto | ErrorResponseDto> {
    try {
      const today = DateTime.now();
      const paymentAmount = item.total_repayment_amount / item.loan_term_months;
      const beResponse = await this.checkBalance(
        item.borrower_phone,
        item.currency,
      );
      if (beResponse instanceof GeneralErrorResponseDto) {
        return beResponse;
      }
      // ii. Check if balance is sufficient to complete the transaction
      if (beResponse < paymentAmount) {
        return new GeneralErrorResponseDto(
          415,
          'Insufficient balance for loan repayment',
        );
      }
      // iii. Deduct the money
      const dmResponse = await this.deductMoney(
        item.lender_phone,
        item.borrower_phone,
        paymentAmount,
        item.currency,
      );
      if (dmResponse instanceof GeneralErrorResponseDto) {
        return dmResponse;
      }

      // iv. Record the transaction
      // const transService = new TransactionsService(this.postgresrest);
      const tranDto = new CreateTransactionDto();
      const loanDto = new CreateLoanDto();
      // const loansService = new LoanService(this.postgresrest);
      tranDto.transaction_type = 'loan repayment';
      tranDto.narrative = 'debit';
      tranDto.sending_wallet = item.borrower_wallet_id;
      tranDto.receiving_wallet = item.lender_wallet_id;
      tranDto.amount = paymentAmount;
      tranDto.transfer_mode = 'WALLETPLUS';
      const transResponse = await this.transactionsService.createTransaction(tranDto);
      if (transResponse instanceof ErrorResponseDto) {
        return transResponse;
      }

      // v. Insert the new loan record
      loanDto.status = loanStatus;
      loanDto.last_payment_date = today.toString();
      loanDto.next_payment_date = today.plus({ days: 30 }).toString();
      loanDto.payment_amount = paymentAmount;
      loanDto.currency = item.currency;
      loanDto.borrower_wallet_id = item.borrower_wallet_id;
      loanDto.lender_wallet_id = item.lender_wallet_id;
      loanDto.collateral_description = item.collateral_description;
      loanDto.due_date = item.due_date;
      loanDto.remaining_balance = item.remaining_balance - paymentAmount;
      loanDto.interest_rate = item.interest_rate;
      const loanResponse = await this.createLoan(loanDto);
      if (loanResponse instanceof ErrorResponseDto) {
        return loanResponse;
      }
      return true;
    } catch (error) {
      this.logger.error(`processRepayment error: ${error}`);
      return new GeneralErrorResponseDto(500, 'processRepayment error', error);
    }
  }

  private async checkBalance(
    mobile: string,
    currency: string,
  ): Promise<number | GeneralErrorResponseDto> {
    try {
      const beRequest = new BalanceEnquiryRequest();
      const scwService = new SmileCashWalletService(this.postgresrest);
      beRequest.channel = 'USSD';
      beRequest.transactorMobile = mobile;
      beRequest.currency = currency;
      const beResponse = await scwService.balanceEnquiry(beRequest);
      if (beResponse instanceof GeneralErrorResponseDto) {
        return beResponse;
      }
      const balance = beResponse.data.data.billerResponse.balance;
      return Number(balance);
    } catch (e) {
      this.logger.error(`checkBalance error: ${JSON.stringify(e)}`);
      return new GeneralErrorResponseDto(500, 'checkBalance error', e);
    }
  }

  private async deductMoney(
    sender: string,
    receiver: string,
    amount: number,
    currency: string,
  ): Promise<boolean | GeneralErrorResponseDto> {
    try {
      const w2wRequest = new WalletToWalletTransferRequest();
      const scwService = new SmileCashWalletService(this.postgresrest);
      w2wRequest.channel = 'USSD';
      w2wRequest.narration = 'Loan repayment';
      w2wRequest.senderPhone = sender;
      w2wRequest.receiverMobile = receiver;
      w2wRequest.amount = amount;
      w2wRequest.currency = currency;
      const w2wResponse = await scwService.walletToWallet(w2wRequest);
      if (w2wResponse instanceof GeneralErrorResponseDto) {
        return w2wResponse;
      }
      return true;
    } catch (e) {
      this.logger.error(`deductMoney error: ${JSON.stringify(e)}`);
      return new GeneralErrorResponseDto(500, 'deductMoney error', e);
    }
  }

  async createLoan(
    createLoanDto: CreateLoanDto,
  ): Promise<Loan | ErrorResponseDto> {
    // const maService = new CooperativeMemberApprovalsService(this.postgresrest);
    // const maDto = new CreateCooperativeMemberApprovalsDto();
    try {
      createLoanDto.id = createLoanDto.id || uuidv4();
      createLoanDto.created_at = DateTime.now().toISO();
      /*
      // Check if the user has an existing loan
      const hasActiveLoan = await this.hasActiveLoan(createLoanDto);
      if (hasActiveLoan instanceof ErrorResponseDto) {
        return hasActiveLoan;
      }
      */
      this.logger.warn('Create loan dto', createLoanDto);
      const { data: loanResponse, error } = await this.postgresrest
        .from('loans')
        .insert(createLoanDto)
        .select()
        .single();
      if (error) {
        this.logger.log(error);
        return new ErrorResponseDto(400, error.details);
      }
      return loanResponse as Loan;
      // Accept the loan request if the applicant does not have active loans
      /*
      if (!hasActiveLoan) {
        const { data: loanResponse, error } = await this.postgresrest
          .from('loans')
          .insert(createLoanDto)
          .select()
          .single();
        if (error) {
          this.logger.log(error);
          return new ErrorResponseDto(400, error.details);
        }
        return loanResponse as Loan;
      } else {
        return new ErrorResponseDto(
          403,
          `User ${createLoanDto.profile_id} has an active loan and cannot apply for another one`,
        );
      }
      */
    } catch (error) {
      return new ErrorResponseDto(500, error);
    }
  }

  async findAllLoans(): Promise<Loan[] | ErrorResponseDto> {
    try {
      const { data, error } = await this.postgresrest
        .from('loans')
        .select()
        .order('created_at', { ascending: false });

      if (error) {
        this.logger.error('Error fetching loans', error);
        return new ErrorResponseDto(400, error.details);
      }

      return data as Loan[];
    } catch (error) {
      this.logger.error('Exception in findAllLoan', error);
      return new ErrorResponseDto(500, error);
    }
  }

  async viewLoan(id: string): Promise<CreateLoanDto | ErrorResponseDto> {
    try {
      const { data, error } = await this.postgresrest
        .from('loans')
        .select()
        .eq('id', id)
        .single();

      if (error) {
        this.logger.error(`Error fetching loan ${id}`, error);
        return new ErrorResponseDto(400, error.details);
      }

      return data as CreateLoanDto;
    } catch (error) {
      this.logger.error(`Exception in viewLoan for id ${id}`, error);
      return new ErrorResponseDto(500, error);
    }
  }

  async hasActiveLoan(
    loanDto: CreateLoanDto,
  ): Promise<boolean | ErrorResponseDto> {
    try {
      this.logger.debug(JSON.stringify(loanDto));
      const { data, error } = await this.postgresrest
        .from('loans')
        .select()
        .eq('profile_id', loanDto.profile_id)
        .eq('cooperative_id', loanDto.cooperative_id)
        .eq('status', 'disbursed')
        .maybeSingle();

      if (error) {
        this.logger.error(`Error checking active loan ${loanDto.id}`, error);
        if (error.details == 'The result contains 0 rows') {
          return false; // No active loan found
        }
        return new ErrorResponseDto(400, error.details);
      }
      this.logger.log(`active loan data: ${JSON.stringify(data)}`);
      if (data != null) {
        return true;
      }
      return false;
    } catch (error) {
      this.logger.error(`Exception in viewLoan for id ${loanDto.id}`, error);
      return new ErrorResponseDto(500, error);
    }
  }

  async viewProfileLoans(
    profile_id: string,
  ): Promise<Loan[] | ErrorResponseDto> {
    try {
      const { data, error } = await this.postgresrest
        .from('loans')
        .select()
        .eq('profile_id', profile_id);
      // .single();

      if (error) {
        this.logger.error(
          `Error fetching loan for profile ${profile_id}`,
          error,
        );
        return new ErrorResponseDto(400, error.details);
      }

      return data as Loan[];
    } catch (error) {
      this.logger.error(`Exception in viewLoan for id ${profile_id}`, error);
      return new ErrorResponseDto(500, error);
    }
  }

  async viewCoopLoans(
    cooperative_id: string,
    // profile_id: string,
  ): Promise<Loan[] | ErrorResponseDto> {
    // this.logger.debug(`viewCoopLoans profile_id ${profile_id}`);
    try {
      const { data, error } = await this.postgresrest
        .from('loans')
        .select()
        .eq('cooperative_id', cooperative_id);
      // .neq('profile_id', profile_id);
      // .single();

      if (error) {
        this.logger.error(
          `Error fetching loan for coop ${cooperative_id}`,
          error,
        );
        return new ErrorResponseDto(400, error.details);
      }
      this.logger.debug(`viewCoopLoans data: ${JSON.stringify(data)}`);
      return data as Loan[];
    } catch (error) {
      this.logger.error(
        `Exception in viewLoan for id ${cooperative_id}`,
        error,
      );
      return new ErrorResponseDto(500, error);
    }
  }

  async viewPendingLoan(
    cooperative_id: string,
    profile_id: string,
  ): Promise<Loan[] | ErrorResponseDto> {
    try {
      const { data, error } = await this.postgresrest
        .from('loans')
        .select()
        .eq('cooperative_id', cooperative_id)
        .neq('profile_id', profile_id);
      // .single();

      if (error) {
        this.logger.error(
          `Error fetching loan for coop ${cooperative_id}`,
          error,
        );
        return new ErrorResponseDto(400, error.details);
      }

      return data as Loan[];
    } catch (error) {
      this.logger.error(
        `Exception in viewLoan for id ${cooperative_id}`,
        error,
      );
      return new ErrorResponseDto(500, error);
    }
  }

  async updateLoan(
    id: string,
    updateLoanDto: UpdateLoanDto,
  ): Promise<Loan | ErrorResponseDto> {
    try {
      const { data, error } = await this.postgresrest
        .from('loans')
        .update(updateLoanDto)
        .eq('id', id)
        .select()
        .single();
      if (error) {
        this.logger.error(`Error updating loan ${id}`, error);
        return new ErrorResponseDto(400, error.details);
      }
      return data as Loan;
    } catch (error) {
      this.logger.error(`Exception in updateLoan for id ${id}`, error);
      return new ErrorResponseDto(500, error);
    }
  }

  async updateCoop(
    cooperative_id: string,
    updateLoanDto: UpdateLoanDto,
  ): Promise<Loan[] | ErrorResponseDto> {
    try {
      const { data, error } = await this.postgresrest
        .from('loans')
        .update({
          interest_rate: updateLoanDto.interest_rate,
        })
        .eq('cooperative_id', cooperative_id)
        .select();
      // .single();
      if (error) {
        this.logger.error(`Error updating coop loan ${cooperative_id}`, error);
        return new ErrorResponseDto(400, error.details);
      }
      return data as Loan[];
    } catch (error) {
      this.logger.error(
        `Exception in updateLoan for id ${cooperative_id}`,
        error,
      );
      return new ErrorResponseDto(500, error);
    }
  }

  async deleteLoan(id: string): Promise<boolean | ErrorResponseDto> {
    try {
      const { error } = await this.postgresrest
        .from('loans')
        .delete()
        .eq('id', id)
        .single();

      if (error) {
        this.logger.error(`Error deleting group ${id}`, error);
        return new ErrorResponseDto(400, error.details);
      }

      return true;
    } catch (error) {
      this.logger.error(`Exception in deleteLoan for id ${id}`, error);
      return new ErrorResponseDto(500, error);
    }
  }
}
