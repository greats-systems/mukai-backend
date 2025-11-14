/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-function-type */
import { Logger, Injectable } from '@nestjs/common';
import { ErrorResponseDto } from 'src/common/dto/error-response.dto';
import { PostgresRest } from 'src/common/postgresrest';
import {
  CreateCooperativeDto,
  FiletrCooperativesDto,
  FiletrCooperativesLikeDto,
} from '../dto/create/create-cooperative.dto';
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
    try {
      const groupMembersService = new GroupMemberService(this.postgresrest);
      const walletsService = new WalletsService(this.postgresrest);
      const scwService = new SmileCashWalletService(this.postgresrest);

      this.logger.debug(createCooperativeDto);

      // 1. Check for existing coop and user in parallel

      const [existingCoopResult, existingUserResult] = await Promise.all([
        this.postgresrest
          .from('cooperatives')
          .select()
          .eq('name', createCooperativeDto.name)
          .eq('coop_phone', createCooperativeDto.coop_phone)
          .eq('category', createCooperativeDto.category)
          .eq('city', createCooperativeDto.city),
        this.postgresrest
          .from('profiles')
          .select()
          .eq('phone', createCooperativeDto.coop_phone),
      ]);

      // Handle errors for both queries
      if (existingCoopResult.error) {
        this.logger.error(
          `Failed to check for existing coop: ${JSON.stringify(existingCoopResult.error)}`,
        );
        return new GeneralErrorResponseDto(
          400,
          existingCoopResult.error.message,
          existingCoopResult.error,
        );
      }

      if (existingUserResult.error) {
        this.logger.error(
          `Failed to check for user profile: ${JSON.stringify(existingUserResult.error)}`,
        );
        return new GeneralErrorResponseDto(
          400,
          existingUserResult.error.message,
          existingUserResult.error,
        );
      }

      // Check if cooperative already exists (data array is NOT empty)
      if (existingCoopResult.data && existingCoopResult.data.length > 0) {
        this.logger.log(
          `Coop already exists: ${JSON.stringify(existingCoopResult.data)}`,
        );
        return new GeneralErrorResponseDto(
          409,
          `A cooperative with these details already exists`,
          existingCoopResult.data,
        );
      }

      // Check if user profile exists for the phone number
      /*
      if (existingUserResult.data.length > 0) {
        this.logger.debug(
          `${JSON.stringify(existingUserResult.data.length)} user(s) found with the number ${createCooperativeDto.coop_phone}`,
        );
        this.logger.log(
          `A user with the phone ${createCooperativeDto.coop_phone} already exists`,
        );
        return new GeneralErrorResponseDto(
          409,
          `A user with the phone ${createCooperativeDto.coop_phone} already exists`,
          // null,
        );
      }
      

      // Handle existing user check
      if (existingUserResult.data.length > 0) {
        this.logger.error(
          `Failed to check for existing user: ${JSON.stringify(existingUserResult)}`,
        );
        return new GeneralErrorResponseDto(
          422,
          'User already exists',
          existingUserResult.data,
          // existingUserResult.error,
        );
      }
      if (existingUserResult.data.length > 0) {
        this.logger.log(
          `User found: ${JSON.stringify(existingUserResult.data)}`,
        );
        return new GeneralErrorResponseDto(
          409,
          'This phone number is taken by another user. Please edit your coop info',
          existingUserResult,
        );
      }
      */

      // 2. Create cooperative
      const { data: createCooperativeResponse, error: coopError } =
        await this.postgresrest
          .from('cooperatives')
          .insert(createCooperativeDto)
          .select()
          .single();

      if (coopError) {
        this.logger.error(`Error creating coop: ${JSON.stringify(coopError)}`);
        return new GeneralErrorResponseDto(400, coopError.message, coopError);
      }

      const coopId = createCooperativeResponse.id;

      // 3. Create group member
      const createGroupMemberDto = new CreateGroupMemberDto();
      createGroupMemberDto.cooperative_id = coopId;
      createGroupMemberDto.member_id = createCooperativeDto.admin_id!;

      const groupMemberResponse =
        await groupMembersService.createGroupMember(createGroupMemberDto);
      if (groupMemberResponse instanceof ErrorResponseDto) {
        return groupMemberResponse;
      }

      // 4. Check balances in parallel
      const [scwBalanceResponse, scwBalanceResponseZWG] = await Promise.all([
        scwService.balanceEnquiry({
          transactorMobile: createCooperativeDto.coop_phone,
          currency: 'USD',
          channel: 'USSD',
        } as BalanceEnquiryRequest),
        scwService.balanceEnquiry({
          transactorMobile: createCooperativeDto.coop_phone,
          currency: 'ZWG',
          channel: 'USSD',
        } as BalanceEnquiryRequest),
      ]);

      // 5. Create wallet
      const createWalletDto = new CreateWalletDto();
      createWalletDto.profile_id = createCooperativeDto.admin_id;
      createWalletDto.coop_phone = createCooperativeDto.coop_phone;
      createWalletDto.default_currency = 'usd';
      createWalletDto.is_group_wallet = true;
      createWalletDto.group_id = coopId;

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
          gender: user.gender.toUpperCase(),
          source: 'Smile SACCO',
        } as CreateWalletRequest;

        const scwResponse = await scwService.createWallet(scwRequest);
        if (
          scwResponse instanceof GeneralErrorResponseDto &&
          scwResponse.statusCode != 409
        ) {
          return scwResponse;
        }
      }

      if (scwBalanceResponse instanceof SuccessResponseDto) {
        createWalletDto.balance =
          scwBalanceResponse.data.data.billerResponse.balance;
      }

      const walletResponse = await walletsService.createWallet(createWalletDto);
      if (walletResponse instanceof ErrorResponseDto) {
        return walletResponse;
      }

      // 6. Update cooperative wallet
      const updateCoopDto = new UpdateCooperativeDto();
      updateCoopDto.wallet_id = walletResponse['data']['id'];
      updateCoopDto.id = coopId;

      const updateCoopResponse = await this.updateCooperativeWallet(
        updateCoopDto.id!.toString(),
        updateCoopDto,
      );

      this.logger.debug('updateCoopResponse');
      this.logger.debug(updateCoopResponse);

      // 7. Update admin profile
      const updateUserDto = new SignupDto();
      updateUserDto.id = createCooperativeDto.admin_id!;
      updateUserDto.coop_phone = createCooperativeDto.coop_phone!;

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

      this.logger.debug(`Update response: ${JSON.stringify(updateResponse)}`);

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

  async findAllCooperatives(): Promise<object | ErrorResponseDto> {
    try {
      const { data, error } = await this.postgresrest
        .from('cooperatives')
        .select('*, cooperatives_admin_id_fkey(*)');

      if (error) {
        this.logger.error('Error fetching Cooperatives', error);
        return new ErrorResponseDto(400, error.details);
      }
      this.logger.log(`Coop data: ${JSON.stringify(data)}`);
      return data;
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
        .maybeSingle();

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
        this.logger.log(data && data.length > 0);
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
        .or('has_requested.is.null,has_requested.eq.false')
        .is('cooperative_id', null)
        .order('created_at', { ascending: false })
        .order('first_name', { ascending: true });

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

  async filterCooperatives(
    fcDto: FiletrCooperativesDto,
  ): Promise<SuccessResponseDto | GeneralErrorResponseDto> {
    try {
      this.logger.debug(`fcDto: ${JSON.stringify(fcDto)}`);
      const coopsList: Cooperative[] = [];
      const { data, error } = await this.postgresrest
        .from('cooperatives')
        .select()
        .match({
          category: fcDto.category,
        })
        .or(`province_state.eq.${fcDto.province},city.eq.${fcDto.city}`)
        .order('name', { ascending: true });
      if (error) {
        this.logger.error('Failed to filer cooperatives', error);
      }
      // this.logger.log(`Filtered coops: ${JSON.stringify(data)}`);

      const coops = data as Cooperative[];
      for (const coop of coops) {
        // Check if the member is already active in a coop
        this.logger.warn(coop.name);
        const { data: active, error: activeError } = await this.postgresrest
          .from('group_members')
          .select()
          .eq('cooperative_id', coop.id)
          .eq('member_id', fcDto.profile_id)
          .limit(1)
          .single();
        if (activeError && activeError.code != 'PGRST116') {
          this.logger.error('Failed to fetch group members', activeError);
          return new GeneralErrorResponseDto(
            400,
            'Failed to fetch group members',
            activeError,
          );
        }
        this.logger.warn(`group mambers: ${JSON.stringify(active)}`);
        const { data: request, error: requestError } = await this.postgresrest
          .from('cooperative_member_requests')
          .select()
          .eq('cooperative_id', coop.id)
          .eq('member_id', fcDto.profile_id)
          .limit(1)
          .single();
        if (requestError && requestError.code != 'PGRST116') {
          this.logger.error('Failed to fetch coop request', requestError);
          return new GeneralErrorResponseDto(
            400,
            'Failed to fetch coop request',
            requestError,
          );
        }
        this.logger.debug(
          `active: ${JSON.stringify(active)}, request: ${JSON.stringify(request)}`,
        );
        // Append the list if the user is not in the specified group, and does not have a request to join said grou[]
        if (!active && !request) {
          coopsList.push(coop);
        }
      }

      return new SuccessResponseDto(
        200,
        'Filtered cooperatives fetched successfully',
        coopsList as object[],
      );
    } catch (e) {
      this.logger.error('filterCooperatives error', e);
      return new GeneralErrorResponseDto(500, 'filterCooperatives error', e);
    }
  }

  async filterCooperativesLike(
    fclDto: FiletrCooperativesLikeDto,
  ): Promise<SuccessResponseDto | GeneralErrorResponseDto> {
    try {
      this.logger.debug(`fclDto: ${JSON.stringify(fclDto)}`);
      const coopsList: Cooperative[] = [];
      const { data, error } = await this.postgresrest
        .from('cooperatives')
        .select()
        .or(`category.ilike.%${fclDto.search_term}%,name.ilike.%${fclDto.search_term}%,city.ilike.%${fclDto.search_term}%`)
        .order('name', { ascending: true });
      if (error) {
        this.logger.error('Failed to filer cooperatives', error);
      }
      this.logger.log(`Filtered coops: ${JSON.stringify(data)}`);
      
      const coops = data as Cooperative[];
      for (const coop of coops) {
        // Check if the member is already active in a coop
        this.logger.warn(coop.name);
        const { data: active, error: activeError } = await this.postgresrest
          .from('group_members')
          .select()
          .eq('cooperative_id', coop.id)
          .eq('member_id', fclDto.profile_id)
          .limit(1)
          .single();
        if (activeError && activeError.code != 'PGRST116') {
          this.logger.error('Failed to fetch group members', activeError);
          return new GeneralErrorResponseDto(
            400,
            'Failed to fetch group members',
            activeError,
          );
        }
        this.logger.warn(`group mambers: ${JSON.stringify(active)}`);
        const { data: request, error: requestError } = await this.postgresrest
          .from('cooperative_member_requests')
          .select()
          .eq('cooperative_id', coop.id)
          .eq('member_id', fclDto.profile_id)
          .limit(1)
          .single();
        if (requestError && requestError.code != 'PGRST116') {
          this.logger.error('Failed to fetch coop request', requestError);
          return new GeneralErrorResponseDto(
            400,
            'Failed to fetch coop request',
            requestError,
          );
        }
        this.logger.debug(
          `active: ${JSON.stringify(active)}, request: ${JSON.stringify(request)}`,
        );
        // Append the list if the user is not in the specified group, and does not have a request to join said group
        if (!active && !request) {
          coopsList.push(coop);
        }
      }
      

      return new SuccessResponseDto(
        200,
        'Filtered cooperatives fetched successfully',
        coopsList as object[],
      );
    } catch (e) {
      this.logger.error('filterCooperatives error', e);
      return new GeneralErrorResponseDto(500, 'filterCooperatives error', e);
    }
  }

  async viewAvailableMembersLike(
    searchTerm: string,
  ): Promise<Profile[] | Profile | ErrorResponseDto> {
    try {
      const { data, error } = await this.postgresrest
        .from('profiles')
        .select()
        .ilike('account_type', '%member%')
        .or(
          `first_name.ilike.%${searchTerm}%,last_name.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%,phone.ilike.%${searchTerm}%`,
        )
        .or('is_invited.is.null,is_invited.eq.false')
        .or('has_requested.is.null,has_requested.eq.false')
        .is('cooperative_id', null)
        .order('created_at', { ascending: false })
        .order('first_name', { ascending: true });

      if (error) {
        this.logger.error(`Error fetching available members`, error);
        return new ErrorResponseDto(400, error.details);
      }

      this.logger.log(`viewAvailableMembers data: ${JSON.stringify(data)}`);

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
        .maybeSingle();

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
      // this.logger.log(receivingWallet);

      for (const member of membersJson['member_id'] || []) {
        const walletJson = await walletService.viewProfileWalletID(member);
        // this.logger.log(walletJson);
        walletDetails.push(walletJson['id']);
      }
      // this.logger.log(walletDetails);

      for (const id of walletDetails) {
        const hasPaid = await transactionsService.checkIfSubsPaid(
          receivingWallet,
          id,
          month,
        );
        subsDict.push({ member_id: id, has_paid: hasPaid });
      }

      // this.logger.log(subsDict);

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
    this.logger.log(updateCooperativeDto);
    /**
     * Before updating the interest rate, the members should vote on it first
     */
    try {
      const { data, error } = await this.postgresrest
        .from('cooperatives')
        .update(updateCooperativeDto)
        .eq('id', id)
        .select()
        .maybeSingle();
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
  //   this.logger.log(updateCooperativeDto);
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
  //     this.logger.log(cmaDto);
  //     const cmaResponse =
  //       await cmaService.createCooperativeMemberApprovals(cmaDto);
  //     this.logger.log(cmaResponse);
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
    this.logger.log(updateCooperativeDto);
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
    this.logger.log(updateCooperativeDto);
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
      this.logger.log('Coop data after voting');
      this.logger.log(data);
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
