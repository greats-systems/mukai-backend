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
import { CreateTransactionDto } from '../dto/create/create-transaction.dto';
import { CreateWalletDto } from '../dto/create/create-wallet.dto';
import { TransactionsService } from './transactions.service';
import { Group } from '../entities/group.entity';
import { Profile } from 'src/user/entities/user.entity';
import { SuccessResponseDto } from 'src/common/dto/success-response.dto';
function initLogger(funcname: Function): Logger {
  return new Logger(funcname.name);
}

@Injectable()
export class CooperativesService {
  private readonly logger = initLogger(CooperativesService);
  constructor(private readonly postgresrest: PostgresRest) {}
  async createCooperative(
    createCooperativeDto: CreateCooperativeDto,
  ): Promise<Cooperative | ErrorResponseDto> {
    /* When a cooperative is created, the following steps should be taken:
    1. The new coop is created in the cooperatives table
    2. The coop is also create in the group_members table. Coop ID will act as a foreign key that links the coop and its members
    2. A wallet, with an initial deposit of $100, for said coop is created. The coop ID will act as a foreign key 
    to the cooperatives table
    3. The deposit is recorded in the transactions table
     */
    try {
      const groupMembersService = new GroupMemberService(this.postgresrest);
      const createGroupMemberDto = new CreateGroupMemberDto();
      const walletsService = new WalletsService(this.postgresrest);
      const transactionsService = new TransactionsService(this.postgresrest);
      const createTransactionDto = new CreateTransactionDto();
      const createWalletDto = new CreateWalletDto();
      console.log(createCooperativeDto);

      // Create cooperative
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
      const response =
        await groupMembersService.createGroupMember(createGroupMemberDto);
      console.log('group_member response');
      console.log(response);

      createWalletDto.profile_id = createCooperativeDto.admin_id;
      createWalletDto.balance = 100;
      createWalletDto.default_currency = 'usd';
      createWalletDto.is_group_wallet = true;
      createWalletDto.group_id = createCooperativeResponse['id'];
      const walletResponse = await walletsService.createWallet(createWalletDto);
      console.log('Wallet response');
      console.log(walletResponse);

      createTransactionDto.receiving_wallet = walletResponse['data']['id'];
      createTransactionDto.amount = createWalletDto.balance;
      createTransactionDto.transaction_type = 'deposit';
      createTransactionDto.narrative = 'credit';
      createTransactionDto.currency = createWalletDto.default_currency;
      const transactionResponse =
        await transactionsService.createTransaction(createTransactionDto);

      console.log(transactionResponse);
      console.log(walletResponse);

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
      const walletService = new WalletsService(this.postgresrest);
      const transactionsService = new TransactionsService(this.postgresrest);
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

  async updateCooperative(
    id: string,
    updateCooperativeDto: UpdateCooperativeDto,
  ): Promise<Cooperative | ErrorResponseDto> {
    try {
      const groupMembersService = new GroupMemberService(this.postgresrest);
      const createGroupMemberDto = new CreateGroupMemberDto();
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
      if (updateCooperativeDto.members != null) {
        for (const member of updateCooperativeDto.members) {
          createGroupMemberDto.member_id = member;
          createGroupMemberDto.cooperative_id = id;
          const groupMemberResponse =
            await groupMembersService.createGroupMember(createGroupMemberDto);
          console.log('groupMemberResponse');
          console.log(groupMemberResponse);
        }
      } else {
        console.log('Nothing to update');
      }
      return data as Cooperative;
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
