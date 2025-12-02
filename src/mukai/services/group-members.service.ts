/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-function-type */
import { Logger, Injectable } from '@nestjs/common';
// import { GroupMembers } from '@nestjs/microservices/external/kafka.interface';
import { ErrorResponseDto } from 'src/common/dto/error-response.dto';
import { PostgresRest } from 'src/common/postgresrest';
import { CreateGroupMemberDto } from '../dto/create/create-group-members.dto';
import { UpdateGroupMemberDto } from '../dto/update/update-group-members.dto';
import { GroupMembers } from '../entities/group-members.entity';
import { UpdateCooperativeDto } from '../dto/update/update-cooperative.dto';
import { CooperativesService } from './cooperatives.service';
import { UUID } from 'crypto';

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
  ): Promise<GroupMembers | object | ErrorResponseDto> {
    this.logger.log(createGroupMemberDto);
    try {
      const { data: createGroupMemberResponse, error } = await this.postgresrest
        .from('group_members')
        .insert({
          member_id: createGroupMemberDto.member_id,
          cooperative_id: createGroupMemberDto.cooperative_id,
        })
        // .upsert(createGroupMemberDto, {
        //   onConflict: 'member_id,cooperative_id',
        //   ignoreDuplicates: true,
        // })
        .select()
        .single();
      if (error) {
        this.logger.log(error);
        if (error.details == 'The result contains 0 rows') {
          return {
            data: `User ${createGroupMemberDto.member_id} is already in this group`,
          };
        }
        return new ErrorResponseDto(400, error.details);
      }
      // Update number of members in cooperative
      const groupSize = await this.getNumberOfMembersInGroup(
        createGroupMemberDto.cooperative_id,
      );
      if (groupSize instanceof ErrorResponseDto) {
        return groupSize;
      }
      const coopService = new CooperativesService(this.postgresrest);
      const updateDto = new UpdateCooperativeDto();
      updateDto.id = createGroupMemberDto.cooperative_id as UUID;
      updateDto.no_of_members = groupSize;
      const updateCoopResponse = await coopService.updateCooperative(
        updateDto.id,
        updateDto,
      );
      if (updateCoopResponse instanceof ErrorResponseDto) {
        return updateCoopResponse;
      }
      return createGroupMemberResponse as GroupMembers;
    } catch (error) {
      return new ErrorResponseDto(500, error);
    }
  }

  async findAllGroupMembers(): Promise<GroupMembers[] | ErrorResponseDto> {
    try {
      const { data, error } = await this.postgresrest
        .from('group_members')
        .select()
        .order('created_at', { ascending: false });

      if (error) {
        this.logger.error('Error fetching group', error);
        return new ErrorResponseDto(400, error.details);
      }

      return data as GroupMembers[];
    } catch (error) {
      this.logger.error('Exception in findAllGroupMember', error);
      return new ErrorResponseDto(500, error);
    }
  }

  async findGroupsContainingMember(
    member_id: string,
  ): Promise<GroupMembers[] | ErrorResponseDto> {
    try {
      const { data, error } = await this.postgresrest
        .from('group_members')
        .select('*, cooperative_id(*)')
        .eq('member_id', member_id)
        .order('created_at', { ascending: false });

      if (error) {
        this.logger.error('Error fetching group', error);
        return new ErrorResponseDto(400, error.details);
      }

      return data as GroupMembers[];
    } catch (error) {
      this.logger.error('Exception in findAllGroupMember', error);
      return new ErrorResponseDto(500, error);
    }
  }

  async findMembersInGroup(
    cooperative_id: string,
  ): Promise<GroupMembers[] | ErrorResponseDto> {
    this.logger.log('cooperative_id');
    this.logger.log(cooperative_id);
    try {
      const { data, error } = await this.postgresrest
        .from('group_members')
        .select()
        .eq('cooperative_id', cooperative_id)
        .order('created_at', { ascending: false });

      if (error) {
        this.logger.error('Error fetching group', error);
        return new ErrorResponseDto(400, error.details);
      }

      return data as GroupMembers[];
    } catch (error) {
      this.logger.error('Exception in findAllGroupMember', error);
      return new ErrorResponseDto(500, error);
    }
  }

  async getNumberOfMembersInGroup(
    coop_id: string,
  ): Promise<number | ErrorResponseDto> {
    try {
      const { data, error } = await this.postgresrest
        .from('group_members')
        .select()
        .eq('cooperative_id', coop_id);
      if (error) {
        this.logger.error(`Error fetching group size ${coop_id}`, error);
        return new ErrorResponseDto(400, error.details);
      }
      return data.length;
    } catch (error) {
      this.logger.error(
        `Exception in getNumberOfMembersInGroup for id ${coop_id}`,
        error,
      );
      return new ErrorResponseDto(500, error);
    }
  }

  async viewGroupMember(
    id: string,
  ): Promise<GroupMembers[] | ErrorResponseDto> {
    try {
      const { data, error } = await this.postgresrest
        .from('group_members')
        .select()
        .eq('id', id)
        .single();

      if (error) {
        this.logger.error(`Error fetching group ${id}`, error);
        return new ErrorResponseDto(400, error.details);
      }

      return data as GroupMembers[];
    } catch (error) {
      this.logger.error(`Exception in viewGroupMember for id ${id}`, error);
      return new ErrorResponseDto(500, error);
    }
  }

  async updateGroupMember(
    id: string,
    updateGroupMemberDto: UpdateGroupMemberDto,
  ): Promise<GroupMembers | ErrorResponseDto> {
    try {
      const { data, error } = await this.postgresrest
        .from('group_members')
        .update(updateGroupMemberDto)
        .eq('id', id)
        .select()
        .single();
      if (error) {
        this.logger.error(`Error updating group ${id}`, error);
        return new ErrorResponseDto(400, error.details);
      }
      return data as GroupMembers;
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
        return new ErrorResponseDto(400, error.details);
      }

      return true;
    } catch (error) {
      this.logger.error(`Exception in deleteGroupMember for id ${id}`, error);
      return new ErrorResponseDto(500, error);
    }
  }
}
