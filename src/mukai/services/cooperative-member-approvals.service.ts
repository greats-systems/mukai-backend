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
  ): Promise<CooperativeMemberApprovals | object | ErrorResponseDto> {
    try {
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
        return new ErrorResponseDto(400, error.details);
      }
      return data as CooperativeMemberApprovals;
    } catch (error) {
      return new ErrorResponseDto(500, error);
    }
  }

  async findAllCooperativeMemberApprovals(): Promise<
    CooperativeMemberApprovals[] | ErrorResponseDto
  > {
    try {
      const { data, error } = await this.postgresrest
        .from('cooperative_member_approvals')
        .select()
        .order('created_at', { ascending: false });

      if (error) {
        this.logger.error('Error fetching cooperative_member_approvals', error);
        return new ErrorResponseDto(400, error.details);
      }

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
    // member_id: string,
  ): Promise<SuccessResponseDto | object | ErrorResponseDto> {
    try {
      // First update the group size
      // const gmService = new GroupMemberService(this.postgresrest);
      // const groupSize = await gmService.getNumberOfMembersInGroup(group_id);
      // if (groupSize instanceof ErrorResponseDto) {
      //   return groupSize;
      // }
      // const cmaDto = new UpdateCooperativeMemberApprovalsDto();
      // cmaDto.id = group_id;
      // cmaDto.no_of_members = groupSize;
      // const updateResponse = await this.updateCooperativeMemberApprovals(
      //   cmaDto.id,
      //   cmaDto,
      // );
      // if (updateResponse instanceof ErrorResponseDto) {
      //   return updateResponse;
      // }
      this.logger.log('Successfully updated group size');
      // this.logger.warn(userJson);
      // Fetch data from PostgreSQL
      const { data, error } = await this.postgresrest
        .from('cooperative_member_approvals')
        .select(
          '*,cooperative_member_approvals_group_id_fkey(*),cooperative_member_approvals_profile_id_fkey(*),cooperative_member_approvals_loan_id_fkey(*)',
        )
        // .neq('profile_id', userJson['profile_id'])
        .eq('consensus_reached', false)
        .eq('group_id', group_id);
      // .neq('profile_id', member_id);

      if (error) {
        this.logger.error(
          `Error fetching approvals for group ${group_id}`,
          error,
        );
        return new ErrorResponseDto(400, error.details);
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
  ): Promise<CooperativeMemberApprovals | ErrorResponseDto> {
    try {
      this.logger.log(updateCooperativeMemberApprovalsDto);
      // const approval = await this.viewCooperativeMemberApprovals(u)
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
        return new ErrorResponseDto(400, error.details);
      }
      this.logger.debug(
        `Poll description: ${updateCooperativeMemberApprovalsDto.poll_description}`,
      );
      this.logger.debug(
        `Consensus reached? ${updateCooperativeMemberApprovalsDto.consensus_reached}`,
      );
      if (updateCooperativeMemberApprovalsDto.consensus_reached) {
        // updateCooperativeMemberApprovalsDto.consensus_reached = true;
        if (
          updateCooperativeMemberApprovalsDto.poll_description ==
          'set interest rate'
        ) {
          const setInterestReponse = await this.setInterestRate(
            updateCooperativeMemberApprovalsDto,
          );
          if (!setInterestReponse) {
            this.logger.error('Failed to update interest rate');
            return new ErrorResponseDto(500, 'Failed to update interest rate');
          }
          /*
          const coopService = new CooperativesService(
            this.postgresrest,
            new SmileWalletService(),
          );
          const updateCoopDto = new UpdateCooperativeDto();
          updateCoopDto.interest_rate =
            updateCooperativeMemberApprovalsDto.additional_info;
          updateCoopDto.id =
            updateCooperativeMemberApprovalsDto.group_id as UUID;
          this.logger.debug(updateCoopDto);
          const updateCoopResponse =
            await coopService.updateCooperativeAfterVoting(
              updateCoopDto.id.toString(),
              updateCoopDto,
            );
          this.logger.log(updateCoopResponse);
          */
        } else if (
          updateCooperativeMemberApprovalsDto.poll_description?.includes(
            'loan application',
          )
        ) {
          const loanResponse = await this.disburseLoan(
            updateCooperativeMemberApprovalsDto,
          );
          if (!loanResponse) {
            this.logger.error('Failed to disburse loan');
            return new ErrorResponseDto(500, 'Failed to disburse loan');
          }
          /*
          // Take money from coop wallet and deposit it into the group wallet
          const walletService = new WalletsService(
            this.postgresrest,
            new SmileWalletService(),
          );
          this.logger.warn(updateCooperativeMemberApprovalsDto.profile_id);
          const receivingWallet = await walletService.viewProfileWalletID(
            updateCooperativeMemberApprovalsDto.profile_id!,
          );
          this.logger.debug('receivingWallet');
          this.logger.debug(receivingWallet['data']['id']);
          const disbursingWallet = await walletService.viewCoopWallet(
            updateCooperativeMemberApprovalsDto.group_id!,
          );
          this.logger.debug('disbursingWallet');
          this.logger.debug(disbursingWallet['data']['id']);
          const updateLoanDto = new CreateLoanDto();
          const loanService = new LoanService(this.postgresrest);
          // updateLoanDto.cooperative_id =
          //   updateCooperativeMemberApprovalsDto.group_id;
          // updateLoanDto.borrower_wallet_id = receivingWallet['data']['id'];
          // updateLoanDto.lender_wallet_id = disbursingWallet['data']['id'];
          // updateLoanDto.principal_amount = parseFloat(
          //   updateCooperativeMemberApprovalsDto.additional_info,
          // );
          updateLoanDto.id = updateCooperativeMemberApprovalsDto.loan_id;
          updateLoanDto.status = 'disbursed';
          updateLoanDto.updated_at = DateTime.now().toISO();
          // updateLoanDto.remaining_balance = parseFloat(
          //   updateCooperativeMemberApprovalsDto.additional_info,
          // );
          // updateLoanDto.profile_id =
          //   updateCooperativeMemberApprovalsDto.profile_id;
          // updateLoanDto.cooperative_id =
          //   updateCooperativeMemberApprovalsDto.group_id;
          this.logger.debug('updateLoanDto');
          this.logger.debug(updateLoanDto);
          const loanResponse = await loanService.updateLoan(
            updateLoanDto.id!,
            updateLoanDto,
          );
          this.logger.debug('loanResponse');
          this.logger.debug(loanResponse);
          if (loanResponse instanceof ErrorResponseDto) {
            return loanResponse;
          }

          // Record the transaction
          const transactionDto = new CreateTransactionDto();
          transactionDto.transaction_type = 'loan disbursement';
          transactionDto.category = 'transfer';
          transactionDto.amount =
            updateCooperativeMemberApprovalsDto.additional_info as number;
          transactionDto.narrative = 'credit';
          transactionDto.currency = 'usd';
          transactionDto.receiving_wallet = receivingWallet['data']['id'];
          transactionDto.sending_wallet = disbursingWallet['data']['id'];

          const transService = new TransactionsService(
            this.postgresrest,
            new SmileWalletService(),
          );
          const transactionResponse =
            await transService.createTransaction(transactionDto);
          this.logger.debug('transactionResponse');
          this.logger.debug(transactionResponse);
          */
        } else if (
          updateCooperativeMemberApprovalsDto.poll_description
            ?.toLowerCase()
            .includes('elect')
        ) {
          const electionResponse = await this.updateMemberRole(
            updateCooperativeMemberApprovalsDto,
          );
          if (!electionResponse) {
            // this.logger.error('Failed to update member role');
            return new ErrorResponseDto(400, 'Failed to update member role');
          }
        }
      } else {
        this.logger.debug('Consensus not yet reached');
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

      this.logger.log(`Currency: ${currencyCode}, Loan term: ${loanTerm}`);

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
      const updateLoanDto = new CreateLoanDto();
      updateLoanDto.id = updateCooperativeMemberApprovalsDto.loan_id;
      updateLoanDto.status = 'disbursed';
      updateLoanDto.is_approved = true;
      updateLoanDto.updated_at = DateTime.now().toISO();
      updateLoanDto.remaining_balance = parseFloat(
        updateCooperativeMemberApprovalsDto.additional_info,
      );
      updateLoanDto.profile_id = updateCooperativeMemberApprovalsDto.profile_id;
      updateLoanDto.cooperative_id =
        updateCooperativeMemberApprovalsDto.group_id;

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
