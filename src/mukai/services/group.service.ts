/* eslint-disable @typescript-eslint/no-unsafe-member-access */

/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-function-type */
import { Logger, Injectable } from '@nestjs/common';
import { ErrorResponseDto } from 'src/common/dto/error-response.dto';
import { PostgresRest } from 'src/common/postgresrest';
import { Group } from '../entities/group.entity';
import { CreateGroupDto } from '../dto/create/create-group.dto';
import { UpdateGroupDto } from '../dto/update/update-group.dto';
import { WalletsService } from './wallets.service';
import { TransactionsService } from './transactions.service';
import { CreateWalletDto } from '../dto/create/create-wallet.dto';
import { CreateCooperativeMemberRequestDto } from '../dto/create/create-cooperative-member-request.dto';
import { CooperativeMemberRequestsService } from './cooperative_member_requests.service';
import { GroupMemberService } from './group-members.service';
import { CreateGroupMemberDto } from '../dto/create/create-group-members.dto';
import { CreateTransactionDto } from '../dto/create/create-transaction.dto';
import { Wallet } from '../entities/wallet.entity';
import { SmileWalletService } from 'src/wallet/services/zb_digital_wallet.service';

function initLogger(funcname: Function): Logger {
  return new Logger(funcname.name);
}

@Injectable()
export class GroupService {
  private readonly logger = initLogger(GroupService);
  constructor(private readonly postgresrest: PostgresRest, private readonly smileWalletService: SmileWalletService) {}

  async createGroup(
    createGroupDto: CreateGroupDto,
  ): Promise<Group | ErrorResponseDto> {
    try {
      const groupMembersService = new GroupMemberService(this.postgresrest);
      const createGroupMemberDto = new CreateGroupMemberDto();
      const walletsService = new WalletsService(this.postgresrest, this.smileWalletService);
      const cooperativeMemberRequestsService =
        new CooperativeMemberRequestsService(this.postgresrest);
      const transactionsService = new TransactionsService(this.postgresrest, this.smileWalletService);
      const createTransactionDto = new CreateTransactionDto();
      const createWalletDto = new CreateWalletDto();
      const cooperativeMemberRequestDto =
        new CreateCooperativeMemberRequestDto();
      const { data: createGroupResponse, error } = await this.postgresrest
        .from('group')
        .insert(createGroupDto)
        .select()
        .single();
      if (error) {
        console.log(error);
        return new ErrorResponseDto(400, error.message);
      }

      for (const member of createGroupDto.members) {
        createGroupMemberDto.cooperative_id = createGroupResponse['id'];
        createGroupMemberDto.member_id = member;
        const response =
          await groupMembersService.createGroupMember(createGroupMemberDto);
        console.log(response);
      }

      const walletIDs: string[] = [];
      for (const member of createGroupDto.members || []) {
        const groupMemberWalletsJson =
          await walletsService.viewProfileWalletID(member);
        if (groupMemberWalletsJson instanceof ErrorResponseDto) {
          return groupMemberWalletsJson; // Return the error if wallet lookup failed
        }
        walletIDs.push(groupMemberWalletsJson['id'] ?? '');
      }

      createWalletDto.profile_id = createGroupDto.admin_id;
      createWalletDto.balance = 100;
      createWalletDto.default_currency = 'usd';
      createWalletDto.is_group_wallet = true;
      createWalletDto.group_id = createGroupDto.id;
      createWalletDto.children_wallets = walletIDs;
      const walletResponse = await walletsService.createWallet(createWalletDto);
      createTransactionDto.sending_wallet = walletResponse['id'];
      createTransactionDto.receiving_wallet = walletResponse['id'];
      createTransactionDto.amount = createWalletDto.balance;
      createTransactionDto.transaction_type = 'deposit';
      createTransactionDto.narrative = 'credit';
      const transactionResponse =
        await transactionsService.createTransaction(createTransactionDto);
      console.log(transactionResponse);

      for (const member of createGroupDto.members || []) {
        cooperativeMemberRequestDto.status = 'in a group';
        cooperativeMemberRequestDto.cooperative_id =
          createGroupMemberDto.cooperative_id;
        const updateMemberResponse =
          await cooperativeMemberRequestsService.updateCooperativeMemberRequestByMemberID(
            member,
            cooperativeMemberRequestDto,
          );
        console.log(updateMemberResponse);
        console.log('\n');
        /*
        const updateMemberResponse = await this.postgresrest
          .from('cooperative_member_requests')
          .update(cooperativeMemberRequestDto)
          .eq('member_id', createGroupDto.members![i]['id'])
          .select()
          .single();
          */
      }
      console.log(walletResponse);

      return createGroupResponse as Group;
    } catch (error) {
      return new ErrorResponseDto(500, error);
    }
  }

  async findAllGroups(): Promise<Group[] | ErrorResponseDto> {
    try {
      const { data, error } = await this.postgresrest
        .from('group')
        .select()
        .order('created_at', { ascending: false });

      if (error) {
        this.logger.error('Error fetching group', error);
        return new ErrorResponseDto(400, error.message);
      }

      return data as Group[];
    } catch (error) {
      this.logger.error('Exception in findAllGroup', error);
      return new ErrorResponseDto(500, error);
    }
  }

  async viewGroupsForMember(id: string): Promise<object[] | ErrorResponseDto> {
    try {
      const { data, error } = await this.postgresrest
        .from('cooperative_member_requests')
        .select('group_id, group(*)')
        .eq('member_id', id)
        .order('created_at', { ascending: false });

      if (error) {
        this.logger.error('Error fetching group', error);
        return new ErrorResponseDto(400, error.message);
      }

      return data as object[];
    } catch (error) {
      this.logger.error('Exception in findAllGroup', error);
      return new ErrorResponseDto(500, error);
    }
  }

  async viewGroup(id: string): Promise<Group[] | ErrorResponseDto> {
    try {
      const { data, error } = await this.postgresrest
        .from('group')
        .select()
        .eq('id', id)
        .single();

      if (error) {
        this.logger.error(`Error fetching group ${id}`, error);
        return new ErrorResponseDto(400, error.message);
      }

      return data as Group[];
    } catch (error) {
      this.logger.error(`Exception in viewGroup for id ${id}`, error);
      return new ErrorResponseDto(500, error);
    }
  }

  async viewGroupWallet(group_id: string): Promise<Wallet | ErrorResponseDto> {
    try {
      const { data, error } = await this.postgresrest
        .from('wallets')
        .select()
        .eq('group_id', group_id)
        .single();

      if (error) {
        this.logger.error(`Error fetching group wallet ${group_id}`, error);
        return new ErrorResponseDto(400, error.message);
      }

      return data as Wallet;
    } catch (error) {
      this.logger.error(`Exception in viewGroup for id ${group_id}`, error);
      return new ErrorResponseDto(500, error);
    }
  }

  async checkMemberSubscriptions(
    group_id: string,
    month: string = new Date().toLocaleString('default', { month: 'long' }),
  ): Promise<object | ErrorResponseDto> {
    try {
      // const memberIDs: string[] = [];
      const walletDetails: string[] = [];
      const walletService = new WalletsService(this.postgresrest, this.smileWalletService);
      const transactionsService = new TransactionsService(this.postgresrest, this.smileWalletService);
      const subsDict: object[] = [];
      const { data: membersJson, error: membersError } = await this.postgresrest
        .from('group_members')
        .select('member_id')
        .eq('group_id', group_id);

      if (membersError) {
        this.logger.error(`Error fetching group ${group_id}`, membersError);
        return new ErrorResponseDto(400, membersError.message);
      }

      const groupWalletJson =
        await walletService.viewCooperativeWallet(group_id);
      const receivingWallet = groupWalletJson['id'];
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
      this.logger.error(`Exception in viewGroup for id ${group_id}`, error);
      return new ErrorResponseDto(500, error);
    }
  }

  async updateGroup(
    id: string,
    updateGroupDto: UpdateGroupDto,
  ): Promise<Group | ErrorResponseDto> {
    try {
      const { data, error } = await this.postgresrest
        .from('group')
        .update(updateGroupDto)
        .eq('id', id)
        .select()
        .single();
      if (error) {
        this.logger.error(`Error updating group ${id}`, error);
        return new ErrorResponseDto(400, error.message);
      }
      return data as Group;
    } catch (error) {
      this.logger.error(`Exception in updateGroup for id ${id}`, error);
      return new ErrorResponseDto(500, error);
    }
  }

  async deleteGroup(id: string): Promise<boolean | ErrorResponseDto> {
    try {
      const { error } = await this.postgresrest
        .from('group')
        .delete()
        .eq('id', id)
        .single();

      if (error) {
        this.logger.error(`Error deleting group ${id}`, error);
        return new ErrorResponseDto(400, error.message);
      }

      return true;
    } catch (error) {
      this.logger.error(`Exception in deleteGroup for id ${id}`, error);
      return new ErrorResponseDto(500, error);
    }
  }
}
