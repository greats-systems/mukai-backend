/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-function-type */
import { Logger, Injectable, HttpStatus } from '@nestjs/common';
import { ErrorResponseDto } from 'src/common/dto/error-response.dto';
import { PostgresRest } from 'src/common/postgresrest';
import { CreateCooperativeDto } from '../dto/create/create-cooperative.dto';
import { UpdateCooperativeDto } from '../dto/update/update-cooperative.dto';
import { Cooperative } from '../entities/cooperative.entity';
import { GroupMemberService } from './group-members.service';
import { CreateGroupMemberDto } from '../dto/create/create-group-members.dto';
import { WalletsService } from './wallets.service';
import { CreateWalletDto } from '../dto/create/create-wallet.dto';
import { TransactionsService } from './transactions.service';
import { Group } from '../entities/group.entity';
import { Profile } from 'src/user/entities/user.entity';
import { SuccessResponseDto } from 'src/common/dto/success-response.dto';
import { SmileWalletService } from 'src/wallet/services/zb_digital_wallet.service';
import { SignupDto } from 'src/auth/dto/signup.dto';
import { CooperativeMemberApprovals } from '../entities/cooperative-member-approvals.entity';
import { CreateCooperativeMemberApprovalsDto } from '../dto/create/create-cooperative-member-approvals.dto';
import { CooperativeMemberApprovalsService } from './cooperative-member-approvals.service';
import { SmileCashWalletService } from 'src/common/zb_smilecash_wallet/services/smilecash-wallet.service';
import { GeneralErrorResponseDto } from 'src/common/dto/general-error-response.dto';
import { BalanceEnquiryRequest } from 'src/common/zb_smilecash_wallet/requests/transactions.requests';
function initLogger(funcname: Function): Logger {
  return new Logger(funcname.name);
}

@Injectable()
export class CooperativesService {
  private readonly logger = initLogger(CooperativesService);
  constructor(
    private readonly postgresrest: PostgresRest,
    private readonly smileWalletService: SmileWalletService,
  ) {}
  async createCooperative(
    createCooperativeDto: CreateCooperativeDto,
  ): Promise<Cooperative | GeneralErrorResponseDto | ErrorResponseDto> {
    /* When a cooperative is created, the following steps should be taken:
    1. The new coop is created in the cooperatives table
    2. The coop is also create in the group_members table. Coop ID will act as a foreign key that links the coop and its members
    3. A wallet, with an initial deposit of $100, for said coop is created. The coop ID will act as a foreign key 
       to the cooperatives table
    4. The deposit is recorded in the transactions table
    5. The coop's admin is updated in the profiles table
     */
    try {
      const groupMembersService = new GroupMemberService(this.postgresrest);
      const createGroupMemberDto = new CreateGroupMemberDto();
      const walletsService = new WalletsService(
        this.postgresrest,
        this.smileWalletService,
      );

      const createWalletDto = new CreateWalletDto();
      const updateUserDto = new SignupDto();
      console.log(createCooperativeDto);

      // Create cooperative
      this.logger.debug(createCooperativeDto);
      const { data: createCooperativeResponse, error } = await this.postgresrest
        .from('cooperatives')
        .insert(createCooperativeDto)
        .select()
        .single();
      if (error) {
        console.log(`Error creating coop: ${error.message}`);
        return new ErrorResponseDto(400, error.message);
      }
      console.log('Response data');
      console.log(createCooperativeResponse['id']);

      createGroupMemberDto.cooperative_id = createCooperativeResponse['id'];
      createGroupMemberDto.member_id = createCooperativeDto.admin_id!;
      const response =
        await groupMembersService.createGroupMember(createGroupMemberDto);
      if (response instanceof ErrorResponseDto) {
        return response;
      }
      console.log('group_member response');
      console.log(response);

      createWalletDto.profile_id = createCooperativeDto.admin_id;
      // createWalletDto.balance = 100;
      createWalletDto.coop_phone = createCooperativeDto.coop_phone;
      createWalletDto.default_currency = 'usd';
      createWalletDto.is_group_wallet = true;
      createWalletDto.group_id = createCooperativeResponse['id'];
      const scwService = new SmileCashWalletService(this.postgresrest);
      const balanceEnquiryParams = {
        transactorMobile: createCooperativeDto.coop_phone,
        currency: createWalletDto.default_currency.toUpperCase(), // ZWG | USD
        channel: 'USSD',
      } as BalanceEnquiryRequest;
      const scwBalanceResponse =
        await scwService.balanceEnquiry(balanceEnquiryParams);
      if (scwBalanceResponse instanceof GeneralErrorResponseDto) {
        createWalletDto.balance = 0.0;
        return new GeneralErrorResponseDto(
          HttpStatus.BAD_REQUEST,
          'Failed to check balance',
          scwBalanceResponse,
        );
      }
      createWalletDto.balance =
        scwBalanceResponse.data.data.billerResponse.balance;
      const walletResponse = await walletsService.createWallet(createWalletDto);
      console.log('Wallet response');
      console.log(walletResponse);
      if (walletResponse instanceof ErrorResponseDto) {
        return walletResponse;
      }

      const updateCoopDto = new UpdateCooperativeDto();
      updateCoopDto.wallet_id = walletResponse['data']['id'];
      updateCoopDto.id = createCooperativeResponse['id'];
      const updateCoopResponse = await this.updateCooperativeWallet(
        updateCoopDto.id!.toString(),
        updateCoopDto,
      );
      this.logger.debug('updateCoopResponse');
      this.logger.debug(updateCoopResponse);

      /*
      createTransactionDto.receiving_wallet = walletResponse['data']['id'];
      // createTransactionDto.amount = createWalletDto.balance;
      createTransactionDto.transaction_type = 'initial deposit';
      createTransactionDto.narrative = 'credit';
      createTransactionDto.currency = createWalletDto.default_currency;
      const transactionResponse =
        await transactionsService.createTransaction(createTransactionDto);

      console.log(transactionResponse);
      if (transactionResponse instanceof ErrorResponseDto) {
        return transactionResponse;
      }
      */

      updateUserDto.id = createCooperativeDto.admin_id!;
      updateUserDto.coop_phone = createCooperativeDto.coop_phone!;
      // updateUserDto.cooperative_id = createCooperativeResponse['id'];

      const { data: updateResponse, error: updateError } =
        await this.postgresrest
          .from('profiles')
          .update(updateUserDto)
          .eq('id', updateUserDto.id)
          .select()
          .maybeSingle();
      if (updateError) {
        return new ErrorResponseDto(400, JSON.stringify(updateError));
      }
      console.log(updateResponse);
      return createCooperativeResponse as Cooperative;
    } catch (error) {
      return new ErrorResponseDto(500, error);
    }
  }

  async findAllCooperatives(): Promise<Cooperative[] | ErrorResponseDto> {
    try {
      const { data, error } = await this.postgresrest
        .from('cooperatives')
        .select();

      if (error) {
        this.logger.error('Error fetching Cooperatives', error);
        return new ErrorResponseDto(400, error.message);
      }

      return data as Cooperative[];
    } catch (error) {
      this.logger.error('Exception in findAllCooperatives', error);
      return new ErrorResponseDto(500, error);
    }
  }

  async viewCooperative(id: string): Promise<Cooperative | ErrorResponseDto> {
    try {
      const { data, error } = await this.postgresrest
        .from('cooperatives')
        .select()
        .eq('id', id)
        .single();

      if (error) {
        this.logger.error(`Error fetching Cooperative ${id}`, error);
        if (error.details == 'The result contains 0 rows') {
          return new ErrorResponseDto(
            404,
            `Cooperative with id ${id} not found`,
          );
        }
        return new ErrorResponseDto(400, error.message || 'Unknown error');
      }

      if (!data) {
        return new ErrorResponseDto(404, `Cooperative with id ${id} not found`);
      }

      return data as Cooperative;
    } catch (error) {
      this.logger.error(`Exception in viewCooperative for id ${id}`, error);
      return new ErrorResponseDto(
        500,
        error instanceof Error ? error.message : 'Internal server error',
      );
    }
  }

  async viewCooperativeMembers(
    cooperative_id: string,
  ): Promise<Profile[] | Profile | ErrorResponseDto> {
    try {
      const { data, error } = await this.postgresrest
        .from('group_members')
        .select('member_id, profiles(*)')
        .eq('cooperative_id', cooperative_id);

      if (error) {
        this.logger.error(
          `Error fetching members for cooperative ${cooperative_id}`,
          error,
        );
        return new ErrorResponseDto(400, error.message);
      }

      if (!data || data.length === 0) {
        return new ErrorResponseDto(
          404,
          `Members in cooperative with id ${cooperative_id} not found`,
        );
      }

      // Extract profiles from the data
      const profiles = data.flatMap((item) => item.profiles);

      if (profiles.length === 0) {
        return new ErrorResponseDto(
          404,
          `No member profiles found for cooperative ${cooperative_id}`,
        );
      }

      return profiles.length === 1 ? profiles[0] : profiles;
    } catch (error) {
      this.logger.error(
        `Exception in viewCooperativeMembers for id ${cooperative_id}`,
        error,
      );
      return new ErrorResponseDto(
        500,
        error instanceof Error ? error.message : 'Internal server error',
      );
    }
  }

  async viewCooperativesForMember(
    member_id: string,
  ): Promise<Group[] | ErrorResponseDto | SuccessResponseDto> {
    try {
      const { data, error } = await this.postgresrest
        .from('group_members')
        .select()
        .eq('member_id', member_id)
        .order('created_at', { ascending: false });

      if (error) {
        this.logger.error('Error fetching cooperative', error);
        return new ErrorResponseDto(400, error.message);
      }
      return {
        statusCode: 200,
        message: 'Cooperatives fetched successfully',
        data: data as object[],
      };
    } catch (error) {
      this.logger.error('Exception in viewCooperativesForMember', error);
      return new ErrorResponseDto(500, error);
    }
  }

  async viewCooperativeWallet(
    cooperative_id: string,
  ): Promise<Cooperative[] | ErrorResponseDto> {
    try {
      const { data, error } = await this.postgresrest
        .from('wallets')
        .select()
        .eq('group_id', cooperative_id)
        .single();

      if (error) {
        this.logger.error(`Error fetching group ${cooperative_id}`, error);
        return new ErrorResponseDto(400, error.message);
      }

      return data as Cooperative[];
    } catch (error) {
      this.logger.error(
        `Exception in viewGroup for id ${cooperative_id}`,
        error,
      );
      return new ErrorResponseDto(500, error);
    }
  }

  async checkMemberSubscriptions(
    cooperative_id: string,
    month: string = new Date().toLocaleString('default', { month: 'long' }),
  ): Promise<object | ErrorResponseDto> {
    try {
      // const memberIDs: string[] = [];
      const walletDetails: string[] = [];
      const walletService = new WalletsService(
        this.postgresrest,
        this.smileWalletService,
      );
      const transactionsService = new TransactionsService(
        this.postgresrest,
        this.smileWalletService,
      );
      const subsDict: object[] = [];
      const { data: membersJson, error: membersError } = await this.postgresrest
        .from('group_members')
        .select('member_id')
        .eq('cooperative_id', cooperative_id);

      if (membersError) {
        this.logger.error(
          `Error fetching group ${cooperative_id}`,
          membersError,
        );
        return new ErrorResponseDto(400, membersError.message);
      }

      const cooperativeWalletJson =
        await walletService.viewCooperativeWallet(cooperative_id);
      const receivingWallet = cooperativeWalletJson['id'];
      // console.log(receivingWallet);

      for (const member of membersJson['member_id'] || []) {
        const walletJson = await walletService.viewProfileWalletID(member);
        // console.log(walletJson);
        walletDetails.push(walletJson['id']);
      }
      // console.log(walletDetails);

      for (const id of walletDetails) {
        const hasPaid = await transactionsService.checkIfSubsPaid(
          receivingWallet,
          id,
          month,
        );
        subsDict.push({ member_id: id, has_paid: hasPaid });
      }

      // console.log(subsDict);

      return subsDict;
    } catch (error) {
      this.logger.error(
        `Exception in viewGroup for id ${cooperative_id}`,
        error,
      );
      return new ErrorResponseDto(500, error);
    }
  }

  async updateCooperativeWallet(
    id: string,
    updateCooperativeDto: UpdateCooperativeDto,
  ): Promise<Cooperative | ErrorResponseDto> {
    console.log(updateCooperativeDto);
    /**
     * Before updating the interest rate, the members should vote on it first
     */
    try {
      const { data, error } = await this.postgresrest
        .from('cooperatives')
        .update(updateCooperativeDto)
        .eq('id', id)
        .select()
        .single();
      if (error) {
        this.logger.error(`Error updating Cooperatives ${id}`, error);
        return new ErrorResponseDto(400, error.message);
      }

      return data as Cooperative;
    } catch (error) {
      this.logger.error(`Exception in updateCooperative for id ${id}`, error);
      return new ErrorResponseDto(500, error);
    }
  }

  async updateCooperative(
    id: string,
    updateCooperativeDto: UpdateCooperativeDto,
  ): Promise<CooperativeMemberApprovals | ErrorResponseDto> {
    console.log(updateCooperativeDto);
    /**
     * Before updating the interest rate, the members should vote on it first
     */
    try {
      const cmaDto = new CreateCooperativeMemberApprovalsDto();
      const cmaService = new CooperativeMemberApprovalsService(
        this.postgresrest,
      );
      cmaDto.group_id = id;
      cmaDto.poll_description = 'set interest rate';
      cmaDto.additional_info = updateCooperativeDto.additional_info;
      console.log(cmaDto);
      const cmaResponse =
        await cmaService.createCooperativeMemberApprovals(cmaDto);
      console.log(cmaResponse);
      /*
      const { data, error } = await this.postgresrest
        .from('cooperatives')
        .update(updateCooperativeDto)
        .eq('id', id)
        .select()
        .single();
      if (error) {
        this.logger.error(`Error updating Cooperatives ${id}`, error);
        return new ErrorResponseDto(400, error.message);
      }
      */
      return cmaResponse as CooperativeMemberApprovals;
    } catch (error) {
      this.logger.error(`Exception in updateCooperative for id ${id}`, error);
      return new ErrorResponseDto(500, error);
    }
  }

  async updateCooperativeAfterVoting(
    id: string,
    updateCooperativeDto: UpdateCooperativeDto,
  ): Promise<CooperativeMemberApprovals | ErrorResponseDto> {
    console.log(updateCooperativeDto);
    /**
     * Before updating the interest rate, the members should vote on it first
     */
    try {
      const { data, error } = await this.postgresrest
        .from('cooperatives')
        .update(updateCooperativeDto)
        .eq('id', id)
        .select()
        .single();
      if (error) {
        this.logger.error(`Error updating Cooperatives ${id}`, error);
        return new ErrorResponseDto(400, error.message);
      }
      console.log('Coop data after voting');
      console.log(data);
      return data as CooperativeMemberApprovals;
    } catch (error) {
      this.logger.error(`Exception in updateCooperative for id ${id}`, error);
      return new ErrorResponseDto(500, error);
    }
  }

  async deleteCooperative(id: string): Promise<boolean | ErrorResponseDto> {
    try {
      const { error } = await this.postgresrest
        .from('cooperatives')
        .delete()
        .eq('id', id)
        .single();

      if (error) {
        this.logger.error(`Error deleting Cooperative ${id}`, error);
        return new ErrorResponseDto(400, error.message);
      }

      return true;
    } catch (error) {
      this.logger.error(`Exception in deleteCooperative for id ${id}`, error);
      return new ErrorResponseDto(500, error);
    }
  }
}
