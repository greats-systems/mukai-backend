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
import { CreateWalletDto } from '../dto/create/create-wallet.dto';
import { CreateCooperativeMemberRequestDto } from '../dto/create/create-cooperative-member-request.dto';
import { CooperativeMemberRequestsService } from './cooperative_member_requests.service';

function initLogger(funcname: Function): Logger {
  return new Logger(funcname.name);
}

@Injectable()
export class GroupService {
  private readonly logger = initLogger(GroupService);
  constructor(
    private readonly postgresrest: PostgresRest,
    // private readonly walletsService: WalletsService,
    // private readonly cooperativeMemberRequestsService: CooperativeMemberRequestsService,
    // private readonly createWalletDto: CreateWalletDto,
    // private readonly cooperativeMemberRequestDto: CreateCooperativeMemberRequestDto,
  ) {}

  async createGroup(
    createGroupDto: CreateGroupDto,
  ): Promise<Group | ErrorResponseDto> {
    try {
      const walletsService = new WalletsService(this.postgresrest);
      const cooperativeMemberRequestsService =
        new CooperativeMemberRequestsService(this.postgresrest);
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
      const walletIDs: string[] = [];
      for (const member of createGroupDto.members || []) {
        const groupMemberWalletsJson = await walletsService.viewProfileWalletID(
          member.id,
        );
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

      for (const member of createGroupDto.members || []) {
        cooperativeMemberRequestDto.status = 'in a group';
        cooperativeMemberRequestDto.group_id = member.id;
        const updateMemberResponse =
          await cooperativeMemberRequestsService.updateCooperativeMemberRequestByMemberID(
            member.id,
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

  async viewGroupWallet(group_id: string): Promise<Group[] | ErrorResponseDto> {
    try {
      const { data, error } = await this.postgresrest
        .from('wallets')
        .select()
        .eq('group_id', group_id)
        .single();

      if (error) {
        this.logger.error(`Error fetching group ${group_id}`, error);
        return new ErrorResponseDto(400, error.message);
      }

      return data as Group[];
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
