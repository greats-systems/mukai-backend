/* eslint-disable @typescript-eslint/no-unsafe-function-type */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Logger, Injectable } from '@nestjs/common';
import { ErrorResponseDto } from 'src/common/dto/error-response.dto';
import { PostgresRest } from 'src/common/postgresrest';
import { CreateCooperativeMemberRequestDto } from '../dto/create/create-cooperative-member-request.dto';
import { CooperativeMemberRequest } from '../entities/cooperative-member-request.entity';
import { UpdateCooperativeMemberRequestDto } from '../dto/update/update-cooperative-member-request.dto';

function initLogger(funcname: Function): Logger {
  return new Logger(funcname.name);
}

@Injectable()
export class CooperativeMemberRequestsService {
  private readonly logger = initLogger(CooperativeMemberRequestsService);
  constructor(private readonly postgresrest: PostgresRest) {}

  async createCooperativeMemberRequest(
    createCooperativeMemberRequestDto: CreateCooperativeMemberRequestDto,
  ): Promise<CooperativeMemberRequest | ErrorResponseDto> {
    try {
      // Check if user with member_id already exists
      const { data: existingRequest, error: checkError } =
        await this.postgresrest
          .from('cooperative_member_requests')
          .select()
          .eq('member_id', createCooperativeMemberRequestDto.member_id)
          .single();

      if (checkError && checkError.code !== 'PGRST116') {
        // PGRST116 is the "not found" error code
        this.logger.error('Error checking existing member request', checkError);
        return new ErrorResponseDto(400, checkError.message);
      }

      if (existingRequest) {
        return new ErrorResponseDto(
          400,
          'A request for this member already exists',
        );
      }

      const { data, error } = await this.postgresrest
        .from('cooperative_member_requests')
        .insert(createCooperativeMemberRequestDto)
        .single();
      if (error) {
        this.logger.error('Error creating cooperative member request', error);
        return new ErrorResponseDto(400, error.message);
      }
      return data as CooperativeMemberRequest;
    } catch (error) {
      this.logger.error('Exception in createCooperativeMemberRequest', error);
      return new ErrorResponseDto(500, error);
    }
  }

  async findAllCooperativeMemberRequests(): Promise<
    CooperativeMemberRequest[] | ErrorResponseDto
  > {
    try {
      const { data, error } = await this.postgresrest
        .from('cooperative_member_requests')
        .select();

      if (error) {
        this.logger.error('Error fetching CooperativeMemberRequests', error);
        return new ErrorResponseDto(400, error.message);
      }

      return data as CooperativeMemberRequest[];
    } catch (error) {
      this.logger.error('Exception in findAllCooperativeMemberRequests', error);
      return new ErrorResponseDto(500, error);
    }
  }

  async viewCooperativeMemberRequest(
    id: string,
  ): Promise<CooperativeMemberRequest | ErrorResponseDto> {
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
        return new ErrorResponseDto(400, error.message);
      }

      return data as CooperativeMemberRequest;
    } catch (error) {
      this.logger.error(
        `Exception in viewCooperativeMemberRequest for id ${id}`,
        error,
      );
      return new ErrorResponseDto(500, error);
    }
  }

  async updateCooperativeMemberRequest(
    id: string,
    updateCooperativeMemberRequestDto: UpdateCooperativeMemberRequestDto,
  ): Promise<CooperativeMemberRequest | ErrorResponseDto> {
    try {
      const { data, error } = await this.postgresrest
        .from('cooperative_member_requests')
        .update(updateCooperativeMemberRequestDto)
        .eq('id', id)
        .select()
        .single();
      if (error) {
        this.logger.error(
          `Error updating CooperativeMemberRequests ${id}`,
          error,
        );
        return new ErrorResponseDto(400, error.message);
      }
      return data as CooperativeMemberRequest;
    } catch (error) {
      this.logger.error(
        `Exception in updateCooperativeMemberRequest for id ${id}`,
        error,
      );
      return new ErrorResponseDto(500, error);
    }
  }

  async updateCooperativeMemberRequestByMemberID(
    id: string,
    updateCooperativeMemberRequestDto: UpdateCooperativeMemberRequestDto,
  ): Promise<CooperativeMemberRequest | ErrorResponseDto> {
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
        return new ErrorResponseDto(400, error.message);
      }
      return data as CooperativeMemberRequest;
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
  ): Promise<boolean | ErrorResponseDto> {
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
        return new ErrorResponseDto(400, error.message);
      }

      return true;
    } catch (error) {
      this.logger.error(
        `Exception in deleteCooperativeMemberRequest for id ${id}`,
        error,
      );
      return new ErrorResponseDto(500, error);
    }
  }
}
