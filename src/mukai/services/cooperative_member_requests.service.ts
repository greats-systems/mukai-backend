/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-function-type */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Logger, Injectable } from '@nestjs/common';
import { ErrorResponseDto } from 'src/common/dto/error-response.dto';
import { PostgresRest } from 'src/common/postgresrest';
import { CreateCooperativeMemberRequestDto } from '../dto/create/create-cooperative-member-request.dto';
import { CooperativeMemberRequest } from '../entities/cooperative-member-request.entity';
import { UpdateCooperativeMemberRequestDto } from '../dto/update/update-cooperative-member-request.dto';
import { SuccessResponseDto } from 'src/common/dto/success-response.dto';
import { UserService } from './user.service';
import { SignupDto } from 'src/auth/dto/signup.dto';
import { GroupMemberService } from './group-members.service';
import { CreateGroupMemberDto } from '../dto/create/create-group-members.dto';

function initLogger(funcname: Function): Logger {
  return new Logger(funcname.name);
}

@Injectable()
export class CooperativeMemberRequestsService {
  private readonly logger = initLogger(CooperativeMemberRequestsService);
  constructor(private readonly postgresrest: PostgresRest) {}

  async hasAlreadyJoinedCoop(
    coop_id: string,
    member_id: string,
  ): Promise<boolean | ErrorResponseDto> {
    try {
      const { data, error } = await this.postgresrest
        .from('cooperative_member_requests')
        .select()
        .eq('cooperative_id', coop_id)
        .eq('member_id', member_id)
        .eq('status', 'active')
        .single();
      if (error) {
        this.logger.error('Error checking member who already joined', error);
        return new ErrorResponseDto(400, error.details);
      }
      if (data) {
        this.logger.log(`Member exists:\n${JSON.stringify(data)}`);
        return true;
      }
      return false;
    } catch (error) {
      this.logger.error('hasAlreadyJoinedCoop error', error);
      return new ErrorResponseDto(500, error);
    }
  }

  async hasAlreadyRequestedCoop(
    coop_id: string,
    member_id: string,
  ): Promise<boolean | ErrorResponseDto> {
    try {
      const { data, error } = await this.postgresrest
        .from('cooperative_member_requests')
        .select()
        .eq('cooperative_id', coop_id)
        .eq('member_id', member_id)
        // .eq('status', 'unresolved')
        .or('status.eq.invited,status.eq.unresolved,status.eq.active')
        .single();
      if (error) {
        this.logger.error('Error checking existing member request', error);
        return new ErrorResponseDto(400, error.details);
      }
      if (data) {
        this.logger.log(`Member request exists:\n${JSON.stringify(data)}`);
        return true;
      }
      return false;
    } catch (error) {
      this.logger.error('hasAlreadyRequestedCoop error', error);
      return new ErrorResponseDto(500, error);
    }
  }

  async createCooperativeMemberRequest(
    createCooperativeMemberRequestDto: CreateCooperativeMemberRequestDto,
  ): Promise<SuccessResponseDto | ErrorResponseDto> {
    try {
      // Check if user has already joined the cooperative
      this.logger.log('Checking if they have joined the coop');
      // const hasAlreadyJoined = await this.hasAlreadyJoinedCoop(
      //   createCooperativeMemberRequestDto.cooperative_id!,
      //   createCooperativeMemberRequestDto.member_id!,
      // );
      this.logger.log('Checking if they have requested to join the coop');
      const hasAlreadyRequested = await this.hasAlreadyRequestedCoop(
        createCooperativeMemberRequestDto.cooperative_id!,
        createCooperativeMemberRequestDto.member_id!,
      );
      // if (hasAlreadyJoined) {
      //   return new ErrorResponseDto(
      //     409,
      //     'You have already joined this cooperative',
      //   );
      // }
      if (hasAlreadyRequested) {
        return new ErrorResponseDto(
          409,
          'You have already requsted to join this cooperative',
        );
      }

      const { data, error } = await this.postgresrest
        .from('cooperative_member_requests')
        .insert({
          cooperative_id: createCooperativeMemberRequestDto.cooperative_id,
          member_id: createCooperativeMemberRequestDto.member_id,
          request_type: createCooperativeMemberRequestDto.request_type,
          status: createCooperativeMemberRequestDto.status,
          resolved_by: createCooperativeMemberRequestDto.resolved_by,
          message: createCooperativeMemberRequestDto.message,
          city: createCooperativeMemberRequestDto.city,
          country: createCooperativeMemberRequestDto.country,
          province_state: createCooperativeMemberRequestDto.province_state,
          category: createCooperativeMemberRequestDto.category,
        })
        .select()
        .single();
      if (error) {
        this.logger.error('Error creating cooperative member request', error);
        return new ErrorResponseDto(400, error.details);
      }
      if (createCooperativeMemberRequestDto.is_invited) {
        this.logger.debug(
          `Updating is_invited for user ${createCooperativeMemberRequestDto.member_id}`,
        );
        const profileService = new UserService(this.postgresrest);
        const updateDto = new SignupDto();
        updateDto.is_invited = createCooperativeMemberRequestDto.is_invited;
        this.logger.log(
          `Updating invitation status for ${createCooperativeMemberRequestDto.member_id!}`,
        );
        const updateResponse = await profileService.updateUser(
          createCooperativeMemberRequestDto.member_id!,
          updateDto,
        );
        if (updateResponse instanceof ErrorResponseDto) {
          return new ErrorResponseDto(
            400,
            'Failed to update user invitation status',
            updateResponse.errorObject,
          );
        }
      }
      return {
        statusCode: 201,
        message: 'Cooperative member request created successfully',
        data: data as CooperativeMemberRequest,
      };
    } catch (error) {
      this.logger.error('Exception in createCooperativeMemberRequest', error);
      return new ErrorResponseDto(500, error);
    }
  }

  async findAllCooperativeMemberRequests(): Promise<
    SuccessResponseDto | ErrorResponseDto
  > {
    try {
      const { data, error } = await this.postgresrest
        .from('cooperative_member_requests')
        .select();

      if (error) {
        this.logger.error('Error fetching CooperativeMemberRequests', error);
        return new ErrorResponseDto(400, error.details);
      }

      return {
        statusCode: 200,
        message: 'Cooperative member requests fetched successfully',
        data: data as CooperativeMemberRequest[],
      };
    } catch (error) {
      this.logger.error('Exception in findAllCooperativeMemberRequests', error);
      return new ErrorResponseDto(500, error);
    }
  }

  async findMemberRequestStatus(
    group_id: string,
    status: string,
  ): Promise<SuccessResponseDto | ErrorResponseDto> {
    console.log(`${group_id}/${status}`);
    try {
      const { data, error } = await this.postgresrest
        .from('cooperative_member_requests')
        .select('member_id, profiles(*)')
        .eq('cooperative_id', group_id)
        .eq('status', status);

      if (error) {
        this.logger.error('Error fetching invitations', error);
        return new ErrorResponseDto(400, error.details);
      }

      console.log({
        statusCode: 200,
        message: 'Cooperative member requests fetched successfully',
        data: data,
      });

      return {
        statusCode: 200,
        message: 'Cooperative member requests fetched successfully',
        data: data,
      };
    } catch (error) {
      this.logger.error('Exception in findAllCooperativeMemberRequests', error);
      return new ErrorResponseDto(500, error);
    }
  }

  async findCooperativeInvitations(
    member_id: string,
  ): Promise<SuccessResponseDto | ErrorResponseDto> {
    // console.log(`${group_id}/${status}`);
    try {
      const { data, error } = await this.postgresrest
        .from('cooperative_member_requests')
        .select(
          'status, cooperative_id, cooperative_member_requests_cooperative_id_fkey(*, cooperatives_admin_id_fkey(*))',
        )
        .eq('member_id', member_id)
        .eq('status', 'invited');

      if (error) {
        this.logger.error('Error fetching coop invitations', error);
        return new ErrorResponseDto(400, error.details);
      }

      console.log({
        statusCode: 200,
        message: 'Cooperative invitations fetched successfully',
        data: JSON.stringify(data),
      });

      return {
        statusCode: 200,
        message: 'Cooperative invitations fetched successfully',
        data: data,
      };
    } catch (error) {
      this.logger.error('Exception in findCooperativeInvitations', error);
      return new ErrorResponseDto(500, error);
    }
  }

  async viewCooperativeMemberRequest(
    id: string,
  ): Promise<SuccessResponseDto | ErrorResponseDto> {
    try {
      const { data, error } = await this.postgresrest
        .from('cooperative_member_requests')
        .select()
        .eq('id', id)
        .single();

      if (error) {
        this.logger.error(
          `Error fetching CooperativeMemberRequest ${id}`,
          error,
        );
        return new ErrorResponseDto(400, error.details);
      }

      return {
        statusCode: 200,
        message: 'Cooperative member request fetched successfully',
        data: data as CooperativeMemberRequest,
      };
    } catch (error) {
      this.logger.error(
        `Exception in viewCooperativeMemberRequest for id ${id}`,
        error,
      );
      return new ErrorResponseDto(500, error);
    }
  }

  async getPendingRequestDetails(
    member_id: string,
  ): Promise<SuccessResponseDto | ErrorResponseDto> {
    try {
      const { data, error } = await this.postgresrest
        .from('cooperative_member_requests')
        .select('member_id, profiles(*)')
        .eq('member_id', member_id)
        .single();

      if (error) {
        this.logger.error(
          `Error fetching CooperativeMemberRequest ${member_id}`,
          error,
        );
        return new ErrorResponseDto(400, error.details);
      }

      return {
        statusCode: 200,
        message: 'Cooperative member request fetched successfully',
        data: data as object,
      };
    } catch (error) {
      this.logger.error(
        `Exception in viewCooperativeMemberRequest for id ${member_id}`,
        error,
      );
      return new ErrorResponseDto(500, error);
    }
  }

  async updateCooperativeMemberRequest(
    updateCooperativeMemberRequestDto: UpdateCooperativeMemberRequestDto,
  ): Promise<SuccessResponseDto | ErrorResponseDto> {
    try {
      const { data, error } = await this.postgresrest
        .from('cooperative_member_requests')
        .update(updateCooperativeMemberRequestDto)
        .eq('member_id', updateCooperativeMemberRequestDto.member_id)
        .select();
      if (error) {
        this.logger.error(`Error updating CooperativeMemberRequests`, error);
        return new ErrorResponseDto(400, error.details);
      }

      // If the user's status is active, update the coop size
      if (updateCooperativeMemberRequestDto.status === 'active') {
        // Add member and coop IDs to group_members
        const gmService = new GroupMemberService(this.postgresrest);
        const gmDto = new CreateGroupMemberDto();
        gmDto.member_id = updateCooperativeMemberRequestDto.member_id!;
        gmDto.cooperative_id =
          updateCooperativeMemberRequestDto.cooperative_id!;
        const gmResponse = await gmService.createGroupMember(gmDto);
        if (gmResponse instanceof ErrorResponseDto) {
          return gmResponse;
        }

        // Update the user profile
        const userService = new UserService(this.postgresrest);
        const userDto = new SignupDto();
        userDto.id = updateCooperativeMemberRequestDto.member_id!;
        userDto.cooperative_id =
          updateCooperativeMemberRequestDto.cooperative_id!;
        userDto.is_invited = false;
        const userResponse = await userService.updateUser(userDto.id, userDto);
        if (userResponse instanceof ErrorResponseDto) {
          return userResponse;
        }
      }
      return {
        statusCode: 200,
        message: 'Cooperative member request updated successfully',
        data: data as CooperativeMemberRequest[],
      };
    } catch (error) {
      this.logger.error(
        `Exception in updateCooperativeMemberRequest for id`,
        error,
      );
      return new ErrorResponseDto(500, error);
    }
  }

  async updateCooperativeMemberRequestByMemberID(
    id: string,
    updateCooperativeMemberRequestDto: UpdateCooperativeMemberRequestDto,
  ): Promise<SuccessResponseDto | ErrorResponseDto> {
    try {
      const { data, error } = await this.postgresrest
        .from('cooperative_member_requests')
        .update(updateCooperativeMemberRequestDto)
        .eq('member_id', id)
        .select()
        .single();
      if (error) {
        this.logger.error(
          `Error updating CooperativeMemberRequests ${id}`,
          error,
        );
        return new ErrorResponseDto(400, error.details);
      }
      return {
        statusCode: 200,
        message: 'Cooperative member request updated successfully',
        data: data as CooperativeMemberRequest,
      };
    } catch (error) {
      this.logger.error(
        `Exception in updateCooperativeMemberRequest for id ${id}`,
        error,
      );
      return new ErrorResponseDto(500, error);
    }
  }

  async deleteCooperativeMemberRequest(
    id: string,
  ): Promise<SuccessResponseDto | ErrorResponseDto> {
    try {
      const { error } = await this.postgresrest
        .from('cooperative_member_requests')
        .delete()
        .eq('id', id)
        .single();

      if (error) {
        this.logger.error(
          `Error deleting CooperativeMemberRequest ${id}`,
          error,
        );
        return new ErrorResponseDto(400, error.details);
      }

      return {
        statusCode: 200,
        message: 'Cooperative member request deleted successfully',
        data: true,
      };
    } catch (error) {
      this.logger.error(
        `Exception in deleteCooperativeMemberRequest for id ${id}`,
        error,
      );
      return new ErrorResponseDto(500, error);
    }
  }
}
