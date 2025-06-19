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
import { CooperativeMemberRequestsService } from './cooperative_member_requests.service';
import { CreateCooperativeMemberRequestDto } from '../dto/create/create-cooperative-member-request.dto';
import { CreateTransactionDto } from '../dto/create/create-transaction.dto';
import { CreateWalletDto } from '../dto/create/create-wallet.dto';
import { TransactionsService } from './transactions.service';
import { Group } from '../entities/group.entity';
import { GroupMember } from '@nestjs/microservices/external/kafka.interface';
import { Profile, User } from 'src/user/entities/user.entity';

function initLogger(funcname: Function): Logger {
  return new Logger(funcname.name);
}

@Injectable()
export class CooperativesService {
  private readonly logger = initLogger(CooperativesService);
  constructor(private readonly postgresrest: PostgresRest) {}
  /*
  async createCooperative(
    createCooperativeDto: CreateCooperativeDto,
  ): Promise<Cooperative | ErrorResponseDto> {
    try {
      const { data, error } = await this.postgresrest
        .from('cooperatives')
        .insert(createCooperativeDto)
        .single();
      if (error) {
        console.log(error);
        return new ErrorResponseDto(400, error.message);
      }
      return data as Cooperative;
    } catch (error) {
      return new ErrorResponseDto(500, error);
    }
  }
  */

  async createCooperative(
    createCooperativeDto: CreateCooperativeDto,
  ): Promise<Cooperative | ErrorResponseDto> {
    try {
      const groupMembersService = new GroupMemberService(this.postgresrest);
      const createGroupMemberDto = new CreateGroupMemberDto();
      const walletsService = new WalletsService(this.postgresrest);
      const cooperativeMemberRequestsService =
        new CooperativeMemberRequestsService(this.postgresrest);
      const transactionsService = new TransactionsService(this.postgresrest);
      const createTransactionDto = new CreateTransactionDto();
      const createWalletDto = new CreateWalletDto();
      const cooperativeMemberRequestDto =
        new CreateCooperativeMemberRequestDto();
      console.log(createCooperativeDto);
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

      if (createCooperativeDto.members != null) {
        for (const member of createCooperativeDto.members) {
          createGroupMemberDto.cooperative_id = createCooperativeResponse['id'];
          createGroupMemberDto.member_id = member;
          const response =
            await groupMembersService.createGroupMember(createGroupMemberDto);
          console.log('groupMembersService response');
          console.log(response);
        }

        const walletIDs: string[] = [];
        for (const member of createCooperativeDto.members || []) {
          const cooperativeMemberWalletsJson =
            await walletsService.viewProfileWalletID(member);
          if (cooperativeMemberWalletsJson instanceof ErrorResponseDto) {
            return cooperativeMemberWalletsJson; // Return the error if wallet lookup failed
          }
          walletIDs.push(cooperativeMemberWalletsJson['id'] ?? '');
          createWalletDto.children_wallets = walletIDs;

          cooperativeMemberRequestDto.status = 'in a cooperative';
          cooperativeMemberRequestDto.group_id =
            createGroupMemberDto.cooperative_id;
          const updateMemberResponse =
            await cooperativeMemberRequestsService.updateCooperativeMemberRequestByMemberID(
              member,
              cooperativeMemberRequestDto,
            );
          console.log(updateMemberResponse);
          console.log('\n');
        }
      } else {
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
        const walletResponse =
          await walletsService.createWallet(createWalletDto);
        console.log('Wallet response');
        console.log(walletResponse);
        createTransactionDto.sending_wallet = walletResponse['data']['id'];
        createTransactionDto.receiving_wallet = walletResponse['data']['id'];
        createTransactionDto.amount = createWalletDto.balance;
        createTransactionDto.transaction_type = 'deposit';
        createTransactionDto.narrative = 'credit';
        createTransactionDto.currency = createWalletDto.default_currency;
        const transactionResponse =
          await transactionsService.createTransaction(createTransactionDto);
        console.log(transactionResponse);

        console.log(walletResponse);
      }

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
        return new ErrorResponseDto(400, error.message);
      }

      if (!data) {
        return new ErrorResponseDto(404, `Cooperative with id ${id} not found`);
      }

      return data as Cooperative;
    } catch (error) {
      this.logger.error(`Exception in viewCooperative for id ${id}`, error);
      return new ErrorResponseDto(500, error);
    }
  }

  async viewCooperativeMembers(
    cooperative_id: string,
  ): Promise<Profile[] | Profile | ErrorResponseDto> {
    try {
      const { data, error } = await this.postgresrest
        .from('group_members')
        .select('profiles(*)')
        .eq('cooperative_id', cooperative_id)
        .single();

      if (error) {
        this.logger.error(
          `Error fetching members for cooperative ${cooperative_id}`,
          error,
        );
        return new ErrorResponseDto(400, error.message);
      }

      if (!data) {
        return new ErrorResponseDto(
          404,
          `Members in cooperative with id ${cooperative_id} not found`,
        );
      }
      if (data['profiles'].length == 1) {
        console.log(data);
        return data['profiles'] as object as Profile;
      } else {
        return data['profiles'] as Profile[];
      }
    } catch (error) {
      this.logger.error(
        `Exception in viewCooperativeMembers for id ${cooperative_id}`,
        error,
      );
      return new ErrorResponseDto(500, error);
    }
  }

  async viewCooperativesForMember(
    member_id: string,
  ): Promise<Group[] | ErrorResponseDto> {
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

      return data as Group[];
    } catch (error) {
      this.logger.error('Exception in viewCooperativesForMember', error);
      return new ErrorResponseDto(500, error);
    }
  }
  /*
  async viewCooperativeMembers(
    cooperative_id: string,
  ): Promise<Group[] | ErrorResponseDto> {
    try {
      const { data, error } = await this.postgresrest
        .from('group_members')
        .select()
        .eq('cooperative_id', cooperative_id)
        .order('created_at', { ascending: false });

      if (error) {
        this.logger.error('Error fetching cooperative', error);
        return new ErrorResponseDto(400, error.message);
      }

      return data as Group[];
    } catch (error) {
      this.logger.error('Exception in viewCooperativesForMember', error);
      return new ErrorResponseDto(500, error);
    }
  }
  */

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
