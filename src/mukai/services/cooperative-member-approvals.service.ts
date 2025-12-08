/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-function-type */
import { Logger, Injectable } from '@nestjs/common';
import { ErrorResponseDto } from 'src/common/dto/error-response.dto';
import { PostgresRest } from 'src/common/postgresrest';
import { UpdateCooperativeMemberApprovalsDto } from '../dto/update/update-cooperative-member-approvals.dto';
import { CooperativeMemberApprovals } from '../entities/cooperative-member-approvals.entity';
import { CreateCooperativeMemberApprovalsDto } from '../dto/create/create-cooperative-member-approvals.dto';
import { UUID } from 'crypto';
import { CooperativesService } from './cooperatives.service';
import { UpdateCooperativeDto } from '../dto/update/update-cooperative.dto';
import { CreateLoanDto } from '../dto/create/create-loan.dto';
import { LoanService } from './loan.service';
import { WalletsService } from './wallets.service';
import { CreateTransactionDto } from '../dto/create/create-transaction.dto';
import { TransactionsService } from './transactions.service';
import { DateTime } from 'luxon';
import { SuccessResponseDto } from 'src/common/dto/success-response.dto';
import { SignupDto } from 'src/auth/dto/signup.dto';
import { UserService } from 'src/user/user.service';
import { SmileCashWalletService } from 'src/common/zb_smilecash_wallet/services/smilecash-wallet.service';
import { WalletToWalletTransferRequest } from 'src/common/zb_smilecash_wallet/requests/transactions.requests';
import { CreateCooperativeDto } from '../dto/create/create-cooperative.dto';
import { GeneralErrorResponseDto } from 'src/common/dto/general-error-response.dto';
import { CreateSystemLogDto } from '../dto/create/create-system-logs.dto';
// import { SmileCashWalletService } from 'src/common/zb_smilecash_wallet/services/smilecash-wallet.service';

function initLogger(funcname: Function): Logger {
  return new Logger(funcname.name);
}

@Injectable()
export class CooperativeMemberApprovalsService {
  private readonly logger = initLogger(CooperativeMemberApprovalsService);
  constructor(private readonly postgresrest: PostgresRest) {}

  // A coop admin can create a new poll only if there are no active polls
  async checkActivePolls(
    cooperative_id: string,
  ): Promise<boolean | ErrorResponseDto> {
    try {
      const { data, error } = await this.postgresrest
        .from('cooperative_member_approvals')
        .select()
        .eq('group_id', cooperative_id)
        .eq('consensus_reached', false);

      if (error) {
        this.logger.error(`Error checking for active polls: ${error.message}`);
        return new ErrorResponseDto(400, error.details);
      }
      if (data) {
        return true;
      }
      return false;
    } catch (error) {
      this.logger.error(`checkActivePolls error: ${error}`);
      return new ErrorResponseDto(500, error);
    }
  }

  async createCooperativeMemberApprovals(
    createCooperativeMemberApprovalsDto: CreateCooperativeMemberApprovalsDto,
    logged_in_user_id: string,
    platform: string,
  ): Promise<CooperativeMemberApprovals | object | ErrorResponseDto> {
    try {
      const slDto = new CreateSystemLogDto();
      slDto.profile_id = logged_in_user_id;
      slDto.platform = platform;
      slDto.action = 'create a new poll';
      slDto.request = createCooperativeMemberApprovalsDto;
      slDto.cooperative_id = createCooperativeMemberApprovalsDto.group_id;
      this.logger.debug(createCooperativeMemberApprovalsDto);
      const { data, error } = await this.postgresrest
        .from('cooperative_member_approvals')
        .upsert(
          {
            group_id: createCooperativeMemberApprovalsDto.group_id,
            // no_of_members: groupSize,
            profile_id: createCooperativeMemberApprovalsDto.profile_id,
            poll_description:
              createCooperativeMemberApprovalsDto.poll_description,
            additional_info:
              createCooperativeMemberApprovalsDto.additional_info,
            asset_id: createCooperativeMemberApprovalsDto.asset_id,
            elected_member_profile_id:
              createCooperativeMemberApprovalsDto.elected_member_profile_id,
            loan_id: createCooperativeMemberApprovalsDto.loan_id,
          },
          {
            // onConflict: 'group_id,poll_description,asset_id',
            ignoreDuplicates: true,
          },
        )
        .select()
        .single();
      if (error) {
        this.logger.log(error);
        slDto.response = error;
        const { data: log, error: logError } = await this.postgresrest
          .from('system_logs')
          .insert(slDto)
          .select()
          .single();
        if (logError) {
          this.logger.error('Failed to insert system log record', logError);
          return new ErrorResponseDto(
            400,
            'Failed to insert system log record',
            logError,
          );
        }
        this.logger.warn('System log created', log);
        return new ErrorResponseDto(400, error.details);
      }
      slDto.action = 'create a new poll';
      slDto.request = createCooperativeMemberApprovalsDto;
      slDto.response = {
        statusCode: 201,
        message: 'Poll created successfully',
      };
      slDto.poll_id = data.id;
      const { data: log, error: logError } = await this.postgresrest
        .from('system_logs')
        .insert(slDto)
        .select()
        .single();
      if (logError) {
        this.logger.error('Failed to insert system log record', logError);
        return new ErrorResponseDto(
          400,
          'Failed to insert system log record',
          logError,
        );
      }
      this.logger.warn('System log created', log);
      return data as CooperativeMemberApprovals;
    } catch (error) {
      return new ErrorResponseDto(500, error);
    }
  }

  async findAllCooperativeMemberApprovals(
    logged_in_user_id: string,
    platform: string,
  ): Promise<CooperativeMemberApprovals[] | ErrorResponseDto> {
    try {
      const slDto = new CreateSystemLogDto();
      slDto.platform = platform;
      slDto.profile_id = logged_in_user_id;
      slDto.action = 'view all polls';
      const { data, error } = await this.postgresrest
        .from('cooperative_member_approvals')
        .select()
        .order('created_at', { ascending: false });

      if (error) {
        this.logger.error('Error fetching cooperative_member_approvals', error);
        return new ErrorResponseDto(400, error.details);
      }
      slDto.response = {
        statusCode: 200,
        message: 'Polls fetched successfully',
      };

      return data as CooperativeMemberApprovals[];
    } catch (error) {
      this.logger.error(
        'Exception in findAllCooperativeMemberApprovals',
        error,
      );
      return new ErrorResponseDto(500, error);
    }
  }

  async viewCooperativeMemberApprovals(
    id: string,
  ): Promise<CooperativeMemberApprovals[] | ErrorResponseDto> {
    try {
      const { data, error } = await this.postgresrest
        .from('cooperative_member_approvals')
        .select()
        .eq('id', id)
        .single();

      if (error) {
        this.logger.error(`Error fetching group ${id}`, error);
        return new ErrorResponseDto(400, error.details);
      }

      return data as CooperativeMemberApprovals[];
    } catch (error) {
      this.logger.error(
        `Exception in viewCooperativeMemberApprovals for id ${id}`,
        error,
      );
      return new ErrorResponseDto(500, error);
    }
  }

  async viewCooperativeMemberApprovalsByCoop(
    group_id: string,
    logged_in_user_id: string,
    platform: string,
  ): Promise<SuccessResponseDto | object | ErrorResponseDto> {
    try {
      const slDto = new CreateSystemLogDto();
      slDto.profile_id = logged_in_user_id;
      slDto.action = 'view polls for group';
      slDto.cooperative_id = group_id;
      slDto.platform = platform;
      const { data, error } = await this.postgresrest
        .from('cooperative_member_approvals')
        .select(
          '*,cooperative_member_approvals_group_id_fkey(*),cooperative_member_approvals_profile_id_fkey(*),cooperative_member_approvals_loan_id_fkey(*)',
        )
        // .neq('profile_id', userJson['profile_id'])
        .eq('consensus_reached', false)
        .eq('group_id', group_id)
        .order('created_at', { ascending: false });
      // .neq('profile_id', member_id);

      if (error) {
        this.logger.error(
          `Error fetching approvals for group ${group_id}`,
          error,
        );
        slDto.response = error;
        const { data: log, error: logError } = await this.postgresrest
          .from('system_logs')
          .insert(slDto)
          .select()
          .single();
        if (logError) {
          return new ErrorResponseDto(
            400,
            'Failed to insert into system_logs',
            error,
          );
        }
        this.logger.warn('Log created', log);
        return new ErrorResponseDto(
          400,
          `Error fetching approvals for group ${group_id}`,
          error,
        );
      }
      if (!data || data.length === 0) {
        this.logger.log(`No approvals found for group ${group_id}`);
        return [];
      }

      // Type assertion
      const approvals = data as CooperativeMemberApprovals[];

      // const grou

      // Process each approval record
      approvals.forEach((record) => {
        this.logger.log(
          `record: ${JSON.stringify(record.cooperative_member_approvals_group_id_fkey.no_of_members)}`,
        );
        // Safely get vote counts (default to 0 if null/undefined)
        const supportingCount = record.supporting_votes?.length || 0;
        const opposingCount = record.opposing_votes?.length || 0;

        // Subtract 1 from total members to exclude admin (ensure it doesn't go below 1)
        const totalMembersExcludingAdmin = Math.max(
          (record.cooperative_member_approvals_group_id_fkey.no_of_members ||
            1) - 1,
          1,
        );

        // Calculate approval ratio (using members excluding admin)
        const approvalRatio = supportingCount / totalMembersExcludingAdmin;
        const has75PercentApproval = approvalRatio >= 0.75;

        // Log detailed information
        this.logger.debug(`Approval ID: ${record.id}`);
        this.logger.debug(`- Supporting votes: ${supportingCount}`);
        this.logger.debug(`- Opposing votes: ${opposingCount}`);
        this.logger.debug(
          `- Total members (excluding admin): ${totalMembersExcludingAdmin}`,
        );
        this.logger.debug(
          `- Approval ratio: ${(approvalRatio * 100).toFixed(0)}%`,
        );
        this.logger.debug(`- 75% approval achieved: ${has75PercentApproval}`);
        record.consensus_reached = has75PercentApproval;
      });

      // this.logger.log(approvals);
      slDto.response = {
        statusCode: 200,
        message: 'Approvals fetched successfully',
      };
      const { data: log, error: logError } = await this.postgresrest
        .from('system_logs')
        .insert(slDto)
        .select()
        .single();
      if (logError) {
        return new ErrorResponseDto(400, 'Failed to reate log', logError);
      }
      this.logger.warn('Log created', log);
      return {
        statusCode: 200,
        message: 'Approvals fetched successfully',
        data: approvals,
      };
    } catch (error) {
      this.logger.error(
        `Exception in viewCooperativeMemberApprovals for group ${group_id}`,
        error,
      );
      return new ErrorResponseDto(500, 'Internal server error');
    }
  }

  async updateCooperativeMemberApprovals(
    id: string,
    updateCooperativeMemberApprovalsDto: UpdateCooperativeMemberApprovalsDto,
    logged_in_user_id: string,
    platform: string,
  ): Promise<CooperativeMemberApprovals | ErrorResponseDto> {
    try {
      const slDto = new CreateSystemLogDto();
      slDto.profile_id = logged_in_user_id;
      slDto.cooperative_id = updateCooperativeMemberApprovalsDto.group_id;
      slDto.action = 'update a poll';
      slDto.request = updateCooperativeMemberApprovalsDto;
      slDto.poll_id = id;
      slDto.cooperative_id = updateCooperativeMemberApprovalsDto.group_id;
      slDto.platform = platform;

      // Fetch coop data
      const { data: coop, error: coopError } = await this.postgresrest
        .from('cooperatives')
        .select()
        .eq('id', updateCooperativeMemberApprovalsDto.group_id)
        .limit(1)
        .single();
      if (coopError) {
        this.logger.error('Failed to fetch coop', coopError);
        slDto.response = coopError;

        const { data: log, error: logError } = await this.postgresrest
          .from('system_logs')
          .insert(slDto)
          .select()
          .single();
        if (logError) {
          this.logger.error('Failed to insert system log record', logError);
          return new ErrorResponseDto(
            400,
            'Failed to insert system log record',
            logError,
          );
        }
        this.logger.warn('System log created', log);
        return new ErrorResponseDto(400, 'Failed to fetch coop', coopError);
      }
      const coopData = coop as CreateCooperativeDto;
      updateCooperativeMemberApprovalsDto.consensus_reached =
        updateCooperativeMemberApprovalsDto.supporting_votes!.length /
          coopData.no_of_members >=
        0.75;

      const { data, error } = await this.postgresrest
        .from('cooperative_member_approvals')
        .update({
          group_id: updateCooperativeMemberApprovalsDto.group_id,
          // no_of_members:
          //   updateCooperativeMemberApprovalsDto.no_of_members,
          supporting_votes:
            updateCooperativeMemberApprovalsDto.supporting_votes,
          opposing_votes: updateCooperativeMemberApprovalsDto.opposing_votes,
          poll_description:
            updateCooperativeMemberApprovalsDto.poll_description,
          additional_info: updateCooperativeMemberApprovalsDto.additional_info,
          updated_at: updateCooperativeMemberApprovalsDto.updated_at,
          consensus_reached:
            updateCooperativeMemberApprovalsDto.consensus_reached,
        })
        .eq('id', id)
        .select()
        .single();
      if (error) {
        this.logger.error(
          `Error updating cooperative_member_approvals ${id}`,
          error,
        );
        slDto.response = coopError;
        const { data: log, error: logError } = await this.postgresrest
          .from('system_logs')
          .insert(slDto)
          .select()
          .single();
        if (logError) {
          this.logger.error('Failed to insert system log record', logError);
          return new ErrorResponseDto(
            400,
            'Failed to insert system log record',
            logError,
          );
        }
        this.logger.warn('System log created', log);
        return new ErrorResponseDto(400, error.details);
      }
      const everyoneVoted =
        updateCooperativeMemberApprovalsDto.supporting_votes!.length +
          updateCooperativeMemberApprovalsDto.opposing_votes!.length ==
        coopData.no_of_members - 1;
      this.logger.debug(
        `Poll description: ${updateCooperativeMemberApprovalsDto.poll_description}`,
      );
      this.logger.debug(
        `Consensus reached? ${updateCooperativeMemberApprovalsDto.consensus_reached}`,
      );
      this.logger.debug(
        `Everyone has voted? ${everyoneVoted}\nsupporting: ${updateCooperativeMemberApprovalsDto.supporting_votes!.length}\nopposing: ${updateCooperativeMemberApprovalsDto.opposing_votes!.length}\ncoop size: ${coopData.no_of_members - 1}`,
      );
      if (updateCooperativeMemberApprovalsDto.consensus_reached) {
        // updateCooperativeMemberApprovalsDto.consensus_reached = true;
        this.logger.debug(
          `Voting for ${updateCooperativeMemberApprovalsDto.poll_description}`,
        );
        if (
          updateCooperativeMemberApprovalsDto.poll_description?.includes(
            'interest rate',
          )
        ) {
          slDto.action = 'set interest rate';
          const setInterestReponse = await this.setInterestRate(
            updateCooperativeMemberApprovalsDto,
          );
          if (!setInterestReponse) {
            this.logger.error('Failed to update interest rate');
            return new ErrorResponseDto(500, 'Failed to update interest rate');
          }
          const { data: log, error: logError } = await this.postgresrest
            .from('system_logs')
            .insert(slDto)
            .select()
            .single();
          if (logError) {
            this.logger.error('Failed to insert system log record', logError);
            return new ErrorResponseDto(
              400,
              'Failed to insert system log record',
              logError,
            );
          }
        } else if (
          updateCooperativeMemberApprovalsDto.poll_description?.includes(
            'loan application',
          )
        ) {
          slDto.action = 'disburse loan';
          const loanResponse = await this.disburseLoan(
            updateCooperativeMemberApprovalsDto,
          );
          if (!loanResponse) {
            this.logger.error('Failed to disburse loan');
            return new ErrorResponseDto(500, 'Failed to disburse loan');
          }

          // slDto.po = data.id;
          const { data: log, error: logError } = await this.postgresrest
            .from('system_logs')
            .insert(slDto)
            .select()
            .single();
          if (logError) {
            this.logger.error('Failed to insert system log record', logError);
            return new ErrorResponseDto(
              400,
              'Failed to insert system log record',
              logError,
            );
          }
        } else if (
          updateCooperativeMemberApprovalsDto.poll_description
            ?.toLowerCase()
            .includes('elect')
        ) {
          slDto.action = 'election';
          const electionResponse = await this.updateMemberRole(
            updateCooperativeMemberApprovalsDto,
          );
          if (!electionResponse) {
            // this.logger.error('Failed to update member role');
            return new ErrorResponseDto(400, 'Failed to update member role');
          }
          slDto.response = {
            statusCode: 200,
            message: 'Member role updated successfully',
          };
          const { data: log, error: logError } = await this.postgresrest
            .from('system_logs')
            .insert(slDto)
            .select()
            .single();
          if (logError) {
            this.logger.error('Failed to insert system log record', logError);
            return new ErrorResponseDto(
              400,
              'Failed to insert system log record',
              logError,
            );
          }
        } else if (
          updateCooperativeMemberApprovalsDto.poll_description
            ?.toLowerCase()
            .includes('exchange rate')
        ) {
          slDto.action = 'exchange rate';
          const erResponse = await this.setExchangeRate(
            updateCooperativeMemberApprovalsDto,
          );
          if (!erResponse) {
            slDto.response = {
              statusCode: 400,
              message: 'Faield to update exchange rate',
            };
            await this.postgresrest.from('system_logs').insert(slDto);
            this.logger.error('Failed to update exchange rate');
            return new ErrorResponseDto(400, 'Failed to update exchange rate');
          }
          slDto.response = {
            statusCode: 200,
            message: 'Exchange rate updated successfully',
          };
          await this.postgresrest.from('system_logs').insert(slDto);
        }
      } else if (
        everyoneVoted &&
        !updateCooperativeMemberApprovalsDto.consensus_reached
      ) {
        const { data, error } = await this.postgresrest
          .from('cooperative_member_approvals')
          .update({
            consensus_reached: true,
          })
          .eq('id', id);
        if (error) {
          this.logger.error('Failed to update poll', error);
          return new ErrorResponseDto(400, 'Failed to update poll', error);
        }
        slDto.action = 'election';
        slDto.response = {
          statusCode: 200,
          message: `${updateCooperativeMemberApprovalsDto.poll_description} has been opposed`,
        };
        const { data: log, error: logError } = await this.postgresrest
          .from('system_logs')
          .insert(slDto)
          .select()
          .single();
        if (logError) {
          return new ErrorResponseDto(400, 'Failed to create log');
        }
        this.logger.warn('Log created', log);
        return new SuccessResponseDto(
          200,
          `${updateCooperativeMemberApprovalsDto.poll_description} has been opposed`,
        );
      } else {
        this.logger.debug('Consensus not yet reached');
        slDto.response = {
          statusCode: 200,
          message: 'Poll updated successfully',
        };
        const { data: log, error: logError } = await this.postgresrest
          .from('system_logs')
          .insert(slDto)
          .select()
          .single();
        if (logError) {
          return new ErrorResponseDto(400, 'Failed to create log');
        }
        this.logger.warn('Log created', log);
      }
      return data as CooperativeMemberApprovals;
    } catch (error) {
      this.logger.error(
        `Exception in updateCooperativeMemberApprovals for id ${id}`,
        error,
      );
      return new ErrorResponseDto(500, error);
    }
  }

  // Execute these functions when consensus is reached

  async setInterestRate(
    updateCooperativeMemberApprovalsDto: UpdateCooperativeMemberApprovalsDto,
  ): Promise<boolean> {
    const coopService = new CooperativesService(this.postgresrest);
    const updateCoopDto = new UpdateCooperativeDto();
    updateCoopDto.interest_rate =
      updateCooperativeMemberApprovalsDto.additional_info;
    updateCoopDto.id = updateCooperativeMemberApprovalsDto.group_id as UUID;
    this.logger.debug(updateCoopDto);
    const updateCoopResponse = await coopService.updateCooperativeAfterVoting(
      updateCoopDto.id.toString(),
      updateCoopDto,
    );
    this.logger.log(updateCoopResponse);
    if (updateCoopResponse instanceof ErrorResponseDto) {
      this.logger.error(`Failed to update coop: ${updateCoopResponse.message}`);
      // return new ErrorResponseDto(400, updateCoopDto);
      return false;
    }

    return true;
  }

  async setExchangeRate(
    updateCooperativeMemberApprovalsDto: UpdateCooperativeMemberApprovalsDto,
  ): Promise<boolean> {
    const coopService = new CooperativesService(this.postgresrest);
    const updateCoopDto = new UpdateCooperativeDto();
    updateCoopDto.exchange_rate =
      updateCooperativeMemberApprovalsDto.additional_info;
    updateCoopDto.id = updateCooperativeMemberApprovalsDto.group_id as UUID;
    this.logger.debug(updateCoopDto);
    const updateCoopResponse = await coopService.updateCooperativeAfterVoting(
      updateCoopDto.id.toString(),
      updateCoopDto,
    );
    this.logger.log(updateCoopResponse);
    if (updateCoopResponse instanceof ErrorResponseDto) {
      this.logger.error(`Failed to update coop: ${updateCoopResponse.message}`);
      // return new ErrorResponseDto(400, updateCoopDto);
      return false;
    }

    return true;
  }

  async disburseLoan(
    updateCooperativeMemberApprovalsDto: UpdateCooperativeMemberApprovalsDto,
  ): Promise<boolean> {
    try {
      this.logger.warn(
        `Loan ID: ${updateCooperativeMemberApprovalsDto.loan_id}`,
      );

      // Initialize services
      const walletService = new WalletsService(this.postgresrest);
      const smileCashService = new SmileCashWalletService(this.postgresrest);
      const loanService = new LoanService(this.postgresrest);
      const transService = new TransactionsService(this.postgresrest);

      // Fetch all required data in parallel
      const [
        { data: sender, error: senderError },
        { data: receiver, error: receiverError },
        { data: loanData, error: loanError },
      ] = await Promise.all([
        this.postgresrest
          .from('cooperatives')
          .select()
          .eq('id', updateCooperativeMemberApprovalsDto.group_id)
          .single(),
        this.postgresrest
          .from('profiles')
          .select()
          .eq('id', updateCooperativeMemberApprovalsDto.profile_id)
          .single(),
        this.postgresrest
          .from('loans')
          .select('currency, loan_term_months')
          .eq('id', updateCooperativeMemberApprovalsDto.loan_id)
          .maybeSingle(),
      ]);

      // Handle errors from data fetching
      if (senderError || receiverError || loanError) {
        this.logger.error('Failed to fetch required data:', {
          senderError,
          receiverError,
          loanError,
        });
        return false;
      }

      if (!sender || !receiver || !loanData) {
        this.logger.error('Required data not found');
        return false;
      }

      const senderPhone = sender.coop_phone;
      const receiverPhone = receiver.phone;
      const currencyCode = loanData.currency;
      const loanTerm = loanData.loan_term_months;

      this.logger.log(
        `Currency: ${currencyCode}, Loan term: ${loanTerm} months`,
      );

      // Execute wallet-to-wallet transfer
      const w2wRequest: WalletToWalletTransferRequest = {
        receiverMobile: receiverPhone,
        senderPhone: senderPhone,
        amount: Number(updateCooperativeMemberApprovalsDto.additional_info),
        currency: currencyCode,
        channel: 'USSD',
        narration: 'loan disbursement',
        transactionId: undefined,
      };

      const smileCashTransaction =
        await smileCashService.walletToWallet(w2wRequest);

      if (smileCashTransaction instanceof ErrorResponseDto) {
        this.logger.error(
          'SmileCash transaction failed:',
          smileCashTransaction,
        );
        return false;
      }

      this.logger.debug('SmileCash transaction successful');

      // Fetch wallets in parallel
      const [receivingWallet, disbursingWallet] = await Promise.all([
        walletService.viewProfileWalletID(
          updateCooperativeMemberApprovalsDto.profile_id!,
        ),
        walletService.viewCoopWallet(
          updateCooperativeMemberApprovalsDto.group_id!,
        ),
      ]);

      // Update loan status
      this.logger.debug(
        `receiving wallet: ${JSON.stringify(receivingWallet)}\nsending wallet: ${JSON.stringify(disbursingWallet)}`,
      );
      const updateLoanDto = new CreateLoanDto();
      updateLoanDto.id = updateCooperativeMemberApprovalsDto.loan_id;
      updateLoanDto.status = 'disbursed';
      updateLoanDto.is_approved = true;
      updateLoanDto.updated_at = DateTime.now().toISO();
      updateLoanDto.date_disbursed = DateTime.now().toISO();
      updateLoanDto.remaining_balance = parseFloat(
        updateCooperativeMemberApprovalsDto.additional_info,
      );
      const currentDate = DateTime.now();
      const dueDate = currentDate.plus({
        months: loanTerm,
      });
      updateLoanDto.due_date = dueDate.toFormat('yyyy-MM-dd');
      // updateLoanDto.due_date = dueDate;
      updateLoanDto.profile_id = updateCooperativeMemberApprovalsDto.profile_id;
      updateLoanDto.cooperative_id =
        updateCooperativeMemberApprovalsDto.group_id;
      this.logger.debug(`Updating loan: ${JSON.stringify(updateLoanDto)}`);
      const loanResponse = await loanService.updateLoan(
        updateLoanDto.id!,
        updateLoanDto,
      );

      if (loanResponse instanceof ErrorResponseDto) {
        this.logger.error('Loan update failed:', loanResponse);
        return false;
      }

      this.logger.debug('Loan update successful');

      // Record transaction
      const transactionDto = new CreateTransactionDto();
      transactionDto.transaction_type = 'loan disbursement';
      transactionDto.category = 'transfer';
      transactionDto.amount = Number(
        updateCooperativeMemberApprovalsDto.additional_info,
      );
      transactionDto.currency = currencyCode;
      transactionDto.narrative = 'debit';
      transactionDto.receiving_wallet = receivingWallet['data'].id;
      transactionDto.receiving_phone = receivingWallet['data'].phone;
      transactionDto.sending_wallet = disbursingWallet['data'].id;
      transactionDto.sending_phone = disbursingWallet['data'].coop_phone;

      const transactionResponse =
        await transService.createTransaction(transactionDto);

      if (transactionResponse instanceof ErrorResponseDto) {
        this.logger.error('Transaction recording failed:', transactionResponse);
        return false;
      }

      this.logger.debug('Transaction recorded successfully');
      return true;
    } catch (error) {
      this.logger.error('Unexpected error in disburseLoan:', error);
      return false;
    }
  }
  async updateMemberRole(
    updateCooperativeMemberApprovalsDto: UpdateCooperativeMemberApprovalsDto,
  ): Promise<boolean> {
    const updateUserDto = new SignupDto();
    const userService = new UserService(this.postgresrest);
    updateUserDto.role = updateCooperativeMemberApprovalsDto.additional_info;
    this.logger.debug(
      JSON.stringify(
        updateCooperativeMemberApprovalsDto.elected_member_profile_id,
      ),
    );
    this.logger.warn(
      `Updating user role to ${updateCooperativeMemberApprovalsDto.additional_info}`,
    );
    const updateUserResponse = await userService.updateUser(
      updateCooperativeMemberApprovalsDto.elected_member_profile_id!,
      updateUserDto,
    );
    if (updateUserResponse instanceof ErrorResponseDto) {
      return false;
    }
    return true;
  }

  async updateCooperativeMemberApprovalsByCoopID(
    group_id: string,
    updateCooperativeMemberApprovalsDto: UpdateCooperativeMemberApprovalsDto,
  ): Promise<CooperativeMemberApprovals[] | null | object | ErrorResponseDto> {
    try {
      // Determine vote type (support or oppose)
      const isSupporting =
        !!updateCooperativeMemberApprovalsDto.supporting_votes;
      const memberId = isSupporting
        ? updateCooperativeMemberApprovalsDto.supporting_votes
        : updateCooperativeMemberApprovalsDto.opposing_votes;

      if (!memberId) {
        return new ErrorResponseDto(
          400,
          'Must provide either supporting_votes or opposing_votes',
        );
      }

      // Check current vote status
      const currentVoteStatus = await this.checkMemberVoteStatus(
        group_id,
        memberId.toString(),
        updateCooperativeMemberApprovalsDto.poll_description!,
      );

      // Cast the vote
      const data = await this.postgresrest.rpc('cast_vote', {
        p_group_id: group_id,
        p_poll_description:
          updateCooperativeMemberApprovalsDto.poll_description,
        p_member_id: memberId,
        p_is_supporting: isSupporting,
      });

      if (data.error) {
        this.logger.error(`Error casting vote: ${data.error.message}`);
        return new ErrorResponseDto(400, data.error.message);
      }

      return {
        previousVote: currentVoteStatus,
        newVote: isSupporting ? 'support' : 'oppose',
        data: data,
      };
    } catch (error) {
      this.logger.error(
        `Exception in updateCooperativeMemberApprovals for id ${group_id}`,
        error,
      );
      return new ErrorResponseDto(500, error.message);
    }
  }

  private async checkMemberVoteStatus(
    groupId: string,
    memberId: string,
    pollDescription: string,
  ): Promise<'support' | 'oppose' | 'none'> {
    const result = await this.postgresrest
      .from('cooperative_member_approvals')
      .select('supporting_votes, opposing_votes')
      .eq('group_id', groupId)
      .eq('poll_description', pollDescription)
      .single();

    if (result.error) throw new Error(result.error.message);

    if (result.data.supporting_votes?.includes(memberId)) {
      return 'support';
    }
    if (result.data.opposing_votes?.includes(memberId)) {
      return 'oppose';
    }
    return 'none';
  }

  async deleteCooperativeMemberApprovals(
    id: string,
  ): Promise<boolean | ErrorResponseDto> {
    try {
      const { error } = await this.postgresrest
        .from('cooperative_member_approvals')
        .delete()
        .eq('id', id)
        .single();

      if (error) {
        this.logger.error(`Error deleting group ${id}`, error);
        return new ErrorResponseDto(400, error.details);
      }

      return true;
    } catch (error) {
      this.logger.error(
        `Exception in deleteCooperativeMemberApprovals for id ${id}`,
        error,
      );
      return new ErrorResponseDto(500, error);
    }
  }
}
