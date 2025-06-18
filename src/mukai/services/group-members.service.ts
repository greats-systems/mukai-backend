/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-function-type */
import { Logger, Injectable } from '@nestjs/common';
import { GroupMember } from '@nestjs/microservices/external/kafka.interface';
import { ErrorResponseDto } from 'src/common/dto/error-response.dto';
import { PostgresRest } from 'src/common/postgresrest';
import { CreateGroupMemberDto } from '../dto/create/create-group-members.dto';
import { UpdateGroupMemberDto } from '../dto/update/update-group-members.dto';

function initLogger(funcname: Function): Logger {
  return new Logger(funcname.name);
}

@Injectable()
export class GroupMemberService {
  private readonly logger = initLogger(GroupMemberService);
  constructor(
    private readonly postgresrest: PostgresRest,
    // private readonly walletsService: WalletsService,
    // private readonly cooperativeMemberRequestsService: CooperativeMemberRequestsService,
    // private readonly createWalletDto: CreateWalletDto,
    // private readonly cooperativeMemberRequestDto: CreateCooperativeMemberRequestDto,
  ) {}

  async createGroupMember(
    createGroupMemberDto: CreateGroupMemberDto,
  ): Promise<GroupMember | ErrorResponseDto> {
    try {
      const { data: createGroupMemberResponse, error } = await this.postgresrest
        .from('group_members')
        .insert(createGroupMemberDto)
        .select()
        .single();
      if (error) {
        console.log(error);
        return new ErrorResponseDto(400, error.message);
      }
      return createGroupMemberResponse as GroupMember;
    } catch (error) {
      return new ErrorResponseDto(500, error);
    }
  }

  async findAllGroupMembers(): Promise<GroupMember[] | ErrorResponseDto> {
    try {
      const { data, error } = await this.postgresrest
        .from('group_members')
        .select()
        .order('created_at', { ascending: false });

      if (error) {
        this.logger.error('Error fetching group', error);
        return new ErrorResponseDto(400, error.message);
      }

      return data as GroupMember[];
    } catch (error) {
      this.logger.error('Exception in findAllGroupMember', error);
      return new ErrorResponseDto(500, error);
    }
  }

  async findGroupsContainingMember(
    member_id: string,
  ): Promise<GroupMember[] | ErrorResponseDto> {
    try {
      const { data, error } = await this.postgresrest
        .from('group_members')
        .select()
        .eq('member_id', member_id)
        .order('created_at', { ascending: false });

      if (error) {
        this.logger.error('Error fetching group', error);
        return new ErrorResponseDto(400, error.message);
      }

      return data as GroupMember[];
    } catch (error) {
      this.logger.error('Exception in findAllGroupMember', error);
      return new ErrorResponseDto(500, error);
    }
  }

  async viewGroupMember(id: string): Promise<GroupMember[] | ErrorResponseDto> {
    try {
      const { data, error } = await this.postgresrest
        .from('group_members')
        .select()
        .eq('id', id)
        .single();

      if (error) {
        this.logger.error(`Error fetching group ${id}`, error);
        return new ErrorResponseDto(400, error.message);
      }

      return data as GroupMember[];
    } catch (error) {
      this.logger.error(`Exception in viewGroupMember for id ${id}`, error);
      return new ErrorResponseDto(500, error);
    }
  }

  async updateGroupMember(
    id: string,
    updateGroupMemberDto: UpdateGroupMemberDto,
  ): Promise<GroupMember | ErrorResponseDto> {
    try {
      const { data, error } = await this.postgresrest
        .from('group_members')
        .update(updateGroupMemberDto)
        .eq('id', id)
        .select()
        .single();
      if (error) {
        this.logger.error(`Error updating group ${id}`, error);
        return new ErrorResponseDto(400, error.message);
      }
      return data as GroupMember;
    } catch (error) {
      this.logger.error(`Exception in updateGroupMember for id ${id}`, error);
      return new ErrorResponseDto(500, error);
    }
  }

  async deleteGroupMember(id: string): Promise<boolean | ErrorResponseDto> {
    try {
      const { error } = await this.postgresrest
        .from('group_members')
        .delete()
        .eq('id', id)
        .single();

      if (error) {
        this.logger.error(`Error deleting group ${id}`, error);
        return new ErrorResponseDto(400, error.message);
      }

      return true;
    } catch (error) {
      this.logger.error(`Exception in deleteGroupMember for id ${id}`, error);
      return new ErrorResponseDto(500, error);
    }
  }
}
