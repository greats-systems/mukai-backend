/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-function-type */
import { Logger, Injectable } from '@nestjs/common';
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
import { SignupDto } from 'src/auth/dto/signup.dto';
import { CooperativeMemberApprovals } from '../entities/cooperative-member-approvals.entity';
import { SmileCashWalletService } from 'src/common/zb_smilecash_wallet/services/smilecash-wallet.service';
import { GeneralErrorResponseDto } from 'src/common/dto/general-error-response.dto';
import { BalanceEnquiryRequest } from 'src/common/zb_smilecash_wallet/requests/transactions.requests';
import { CreateWalletRequest } from 'src/common/zb_smilecash_wallet/requests/registration_and_auth.requests';
function initLogger(funcname: Function): Logger {
  return new Logger(funcname.name);
}

@Injectable()
export class CooperativesService {
  private readonly logger = initLogger(CooperativesService);
  constructor(
    private readonly postgresrest: PostgresRest,
    // private readonly smileWalletService: SmileWalletService,
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

    - Each cooperative will be allocated a ZB merchant account
    - Before creating a coop, make sure that no coop with the exact same parameters exists
     */
    try {
      const groupMembersService = new GroupMemberService(this.postgresrest);
      const createGroupMemberDto = new CreateGroupMemberDto();
      const walletsService = new WalletsService(
        this.postgresrest,
        // this.smileWalletService,
      );

      const createWalletDto = new CreateWalletDto();
      const updateUserDto = new SignupDto();
      console.log(createCooperativeDto);

      // Create cooperative
      this.logger.debug(createCooperativeDto);

      const { data: existingCoop, error: existingCoopError } =
        await this.postgresrest
          .from('cooperatives')
          .select()
          .eq('name', createCooperativeDto.name)
          .eq('coop_phone', createCooperativeDto.phone)
          .eq('category', createCooperativeDto.category)
          .eq('city', createCooperativeDto.city)
          .maybeSingle();

      if (existingCoopError) {
        this.logger.error(
          `Failed to check for existing coop :${JSON.stringify(existingCoopError)}`,
        );
        return new GeneralErrorResponseDto(
          400,
          existingCoopError.message,
          existingCoopError,
        );
      }
      if (existingCoop) {
        this.logger.log(`Coop found: ${JSON.stringify(existingCoop)}`);
        return new GeneralErrorResponseDto(
          409,
          'This coop is taken. Please edit your coop info',
          existingCoop,
        );
      }

      const { data: createCooperativeResponse, error } = await this.postgresrest
        .from('cooperatives')
        .insert(createCooperativeDto)
        .select()
        .single();
      if (error) {
        this.logger.error(`Error creating coop: ${JSON.stringify(error)}`);
        return new GeneralErrorResponseDto(400, error.message, error);
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

      // Do balance enquiry for both USD and ZWG
      const balanceEnquiryParams = {
        transactorMobile: createCooperativeDto.coop_phone,
        currency: 'USD', // ZWG | USD
        channel: 'USSD',
      } as BalanceEnquiryRequest;

      const balanceEnquiryParamsZWG = {
        transactorMobile: createCooperativeDto.coop_phone,
        currency: 'ZWG', // ZWG | USD
        channel: 'USSD',
      } as BalanceEnquiryRequest;
      const scwBalanceResponse =
        await scwService.balanceEnquiry(balanceEnquiryParams);
      const scwBalanceResponseZWG = await scwService.balanceEnquiry(
        balanceEnquiryParamsZWG,
      );
      if (
        scwBalanceResponse instanceof GeneralErrorResponseDto ||
        scwBalanceResponseZWG instanceof GeneralErrorResponseDto
      ) {
        createWalletDto.balance = 0.0;
        createWalletDto.balance_zwg = 0.0;
        const { data, error } = await this.postgresrest
          .from('profiles')
          .select()
          .eq('id', createCooperativeDto.admin_id)
          .maybeSingle();
        if (error) {
          return new GeneralErrorResponseDto(
            400,
            'Failed to fetch admin',
            error,
          );
        }
        const user = data as SignupDto;
        const scwRequest = {
          firstName: user.first_name,
          lastName: user.last_name,
          mobile: user.phone,
          dateOfBirth: user.date_of_birth,
          idNumber: user.national_id_number,
          gender: user.gender.toUpperCase(), //MALE|FEMALE
          source: 'Smile SACCO',
        } as CreateWalletRequest;
        const scwResponse = await scwService.createWallet(scwRequest);
        if (scwRequest instanceof GeneralErrorResponseDto) {
          return scwResponse;
        }
        /*
        return new GeneralErrorResponseDto(
          HttpStatus.BAD_REQUEST,
          'Failed to check balance',
          scwBalanceResponse,
        );
        */
      }
      if (scwBalanceResponse instanceof SuccessResponseDto) {
        createWalletDto.balance =
          scwBalanceResponse.data.data.billerResponse.balance;
      }
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

  async initializeMembers(
    member_id: string,
  ): Promise<object[] | ErrorResponseDto> {
    try {
      const { data, error } = await this.postgresrest
        .from('cooperatives')
        .select()
        .eq('admin_id', member_id)
        .order('created_at', { ascending: false });
      if (error) {
        return new ErrorResponseDto(400, 'Error initializing members', error);
      }
      this.logger.log(`initializeMembers data: ${JSON.stringify(data)}`);
      return data;
    } catch (error) {
      return new ErrorResponseDto(500, 'Error initializing members', error);
    }
  }

  async findAllCooperatives(): Promise<Cooperative[] | ErrorResponseDto> {
    try {
      const { data, error } = await this.postgresrest
        .from('cooperatives')
        .select('*, cooperatives_profile_id_fkey(*)');

      if (error) {
        this.logger.error('Error fetching Cooperatives', error);
        return new ErrorResponseDto(400, error.details);
      }
      this.logger.log(`Coop data: ${JSON.stringify(data)}`);
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
        .select('*, cooperatives_admin_id_fkey(*)')
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
      // this.logger.log(`Coop data: ${JSON.stringify(data)}`);
      return data as Cooperative;
    } catch (error) {
      this.logger.error(`Exception in viewCooperative for id ${id}`, error);
      return new ErrorResponseDto(
        500,
        error instanceof Error ? error.message : 'Internal server error',
      );
    }
  }

  async viewCooperativesForAdmin(
    admin_id: string,
  ): Promise<Cooperative[] | boolean | ErrorResponseDto> {
    try {
      const { data, error } = await this.postgresrest
        .from('cooperatives')
        .select()
        .eq('admin_id', admin_id);

      if (error) {
        this.logger.error(
          `Error fetching Cooperatives for admin ${admin_id}`,
          error,
        );
        if (error.details == 'The result contains 0 rows') {
          return new ErrorResponseDto(
            404,
            `Cooperative with admin_id ${admin_id} not found`,
          );
        }
        return new ErrorResponseDto(400, error.message || 'Unknown error');
      }

      if (!data) {
        return false;
      }

      return data as Cooperative[];
    } catch (error) {
      this.logger.error(
        `Exception in viewCooperativesForAdmin for admin_id ${admin_id}`,
        error,
      );
      return new ErrorResponseDto(
        500,
        error instanceof Error ? error.message : 'Internal server error',
      );
    }
  }

  async checkIfMemberIsCoopAdmin(
    admin_id: string,
    coop_id: string,
  ): Promise<boolean | ErrorResponseDto> {
    try {
      const { data, error } = await this.postgresrest
        .from('cooperatives')
        .select()
        .eq('id', coop_id)
        .eq('admin_id', admin_id);

      if (error) {
        this.logger.error(
          `Error fetching Cooperatives for admin ${admin_id}`,
          error,
        );
        if (error.details == 'The result contains 0 rows') {
          return new ErrorResponseDto(
            404,
            `Cooperative with admin_id ${admin_id} not found`,
          );
        }
        return new ErrorResponseDto(400, error.message || 'Unknown error');
      }

      this.logger.log(`admin coop: ${JSON.stringify(data)} ${!data}`);

      // FIX: Check if the array has any elements, not just if data exists
      if (data && data.length > 0) {
        return true;
      }

      return false;
    } catch (error) {
      this.logger.error(
        `Exception in viewCooperativesForAdmin for admin_id ${admin_id}`,
        error,
      );
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
        .eq('cooperative_id', cooperative_id)
        .order('created_at', { ascending: false });

      if (error) {
        this.logger.error(
          `Error fetching members for cooperative ${cooperative_id}`,
          error,
        );
        return new ErrorResponseDto(400, error.details);
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

  async viewAvailableMembers(): Promise<
    Profile[] | Profile | ErrorResponseDto
  > {
    try {
      const { data, error } = await this.postgresrest
        .from('profiles')
        .select()
        .ilike('account_type', '%member%')
        .or('is_invited.is.null,is_invited.eq.false')
        .is('cooperative_id', null)
        .order('first_name', { ascending: true })
        .order('created_at', { ascending: false });

      if (error) {
        this.logger.error(`Error fetching available members`, error);
        return new ErrorResponseDto(400, error.details);
      }

      // this.logger.log(`viewAvailableMembers data: ${JSON.stringify(data)}`);

      if (!data || data.length === 0) {
        return new ErrorResponseDto(404, `Members not found`);
      }

      // Extract profiles from the data
      const profiles = data.flatMap((item) => item.profiles);

      if (profiles.length === 0) {
        return new ErrorResponseDto(404, `No member profiles found`);
      }

      return data;
    } catch (error) {
      this.logger.error(`Exception in viewAvailableMembers`, error);
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
        .select('*,coop_members_cooperative_id_fkey(*)')
        .eq('member_id', member_id)
        .order('created_at', { ascending: false });

      if (error) {
        this.logger.error('Error fetching cooperative', error);
        return new ErrorResponseDto(400, error.details);
      }
      // this.logger.debug(`Coops for ${member_id}: ${JSON.stringify(data)}`);
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
        return new ErrorResponseDto(400, error.details);
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
        // this.smileWalletService,
      );
      const transactionsService = new TransactionsService(
        this.postgresrest,
        // this.smileWalletService,
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
        return new ErrorResponseDto(400, error.details);
      }

      return data as Cooperative;
    } catch (error) {
      this.logger.error(`Exception in updateCooperative for id ${id}`, error);
      return new ErrorResponseDto(500, error);
    }
  }

  // async updateCooperative(
  //   id: string,
  //   updateCooperativeDto: UpdateCooperativeDto,
  // ): Promise<CooperativeMemberApprovals | ErrorResponseDto> {
  //   console.log(updateCooperativeDto);
  //   /**
  //    * Before updating the interest rate, the members should vote on it first
  //    */
  //   try {
  //     const cmaDto = new CreateCooperativeMemberApprovalsDto();
  //     const cmaService = new CooperativeMemberApprovalsService(
  //       this.postgresrest,
  //     );
  //     cmaDto.group_id = id;
  //     cmaDto.poll_description = 'set interest rate';
  //     cmaDto.additional_info = updateCooperativeDto.additional_info;
  //     console.log(cmaDto);
  //     const cmaResponse =
  //       await cmaService.createCooperativeMemberApprovals(cmaDto);
  //     console.log(cmaResponse);
  //     /*
  //     const { data, error } = await this.postgresrest
  //       .from('cooperatives')
  //       .update(updateCooperativeDto)
  //       .eq('id', id)
  //       .select()
  //       .single();
  //     if (error) {
  //       this.logger.error(`Error updating Cooperatives ${id}`, error);
  //       return new ErrorResponseDto(400, error.details);
  //     }
  //     */
  //     return cmaResponse as CooperativeMemberApprovals;
  //   } catch (error) {
  //     this.logger.error(`Exception in updateCooperative for id ${id}`, error);
  //     return new ErrorResponseDto(500, error);
  //   }
  // }

  async updateCooperative(
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
        return new ErrorResponseDto(400, error.details);
      }

      return data as Cooperative;
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
        return new ErrorResponseDto(400, error.details);
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
        return new ErrorResponseDto(400, error.details);
      }

      return true;
    } catch (error) {
      this.logger.error(`Exception in deleteCooperative for id ${id}`, error);
      return new ErrorResponseDto(500, error);
    }
  }
}
