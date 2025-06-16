/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-function-type */
import { Logger, Injectable } from '@nestjs/common';
import { ErrorResponseDto } from 'src/common/dto/error-response.dto';
import { PostgresRest } from 'src/common/postgresrest';
import { UpdateCooperativeMemberApprovalsDto } from '../dto/update/update-cooperative-member-approvals.dto';
import { CooperativeMemberApprovals } from '../entities/cooperative-member-approvals.entity';
import { CreateCooperativeMemberApprovalsDto } from '../dto/create/create-cooperative-member-approvals.dto';

function initLogger(funcname: Function): Logger {
  return new Logger(funcname.name);
}

@Injectable()
export class CooperativeMemberApprovalsService {
  private readonly logger = initLogger(CooperativeMemberApprovalsService);
  constructor(private readonly postgresrest: PostgresRest) {}

  async createCooperativeMemberApprovals(
    createCooperativeMemberApprovalsDto: CreateCooperativeMemberApprovalsDto,
  ): Promise<CooperativeMemberApprovals | ErrorResponseDto> {
    try {
      const { data, error } = await this.postgresrest
        .from('cooperative_member_approvals')
        .insert(createCooperativeMemberApprovalsDto)
        .single();
      if (error) {
        console.log(error);
        return new ErrorResponseDto(400, error.message);
      }
      return data as CooperativeMemberApprovals;
    } catch (error) {
      return new ErrorResponseDto(500, error);
    }
  }

  async findAllCooperativeMemberApprovals(): Promise<
    CooperativeMemberApprovals[] | ErrorResponseDto
  > {
    try {
      const { data, error } = await this.postgresrest
        .from('cooperative_member_approvals')
        .select()
        .order('created_at', { ascending: false });

      if (error) {
        this.logger.error('Error fetching cooperative_member_approvals', error);
        return new ErrorResponseDto(400, error.message);
      }

      return data as CooperativeMemberApprovals[];
    } catch (error) {
      this.logger.error(
        'Exception in findAllCooperativeMemberApprovals',
        error,
      );
      return new ErrorResponseDto(500, error);
    }
  }

  async viewCooperativeMemberApprovals(
    wallet_id: string,
  ): Promise<CooperativeMemberApprovals[] | ErrorResponseDto> {
    try {
      const { data, error } = await this.postgresrest
        .from('cooperative_member_approvals')
        .select()
        .eq('wallet_id', wallet_id)
        .single();

      if (error) {
        this.logger.error(`Error fetching group ${wallet_id}`, error);
        return new ErrorResponseDto(400, error.message);
      }

      return data as CooperativeMemberApprovals[];
    } catch (error) {
      this.logger.error(
        `Exception in viewCooperativeMemberApprovals for id ${wallet_id}`,
        error,
      );
      return new ErrorResponseDto(500, error);
    }
  }

  async updateCooperativeMemberApprovals(
    wallet_id: string,
    updateCooperativeMemberApprovalsDto: UpdateCooperativeMemberApprovalsDto,
  ): Promise<CooperativeMemberApprovals | ErrorResponseDto> {
    try {
      const { data, error } = await this.postgresrest
        .from('cooperative_member_approvals')
        .update(updateCooperativeMemberApprovalsDto)
        .eq('wallet_id', wallet_id)
        .select()
        .single();
      if (error) {
        this.logger.error(
          `Error updating cooperative_member_approvals ${wallet_id}`,
          error,
        );
        return new ErrorResponseDto(400, error.message);
      }
      return data as CooperativeMemberApprovals;
    } catch (error) {
      this.logger.error(
        `Exception in updateCooperativeMemberApprovals for id ${wallet_id}`,
        error,
      );
      return new ErrorResponseDto(500, error);
    }
  }

  async deleteCooperativeMemberApprovals(
    id: string,
  ): Promise<boolean | ErrorResponseDto> {
    try {
      const { error } = await this.postgresrest
        .from('cooperative_member_approvals')
        .delete()
        .eq('id', id)
        .single();

      if (error) {
        this.logger.error(`Error deleting group ${id}`, error);
        return new ErrorResponseDto(400, error.message);
      }

      return true;
    } catch (error) {
      this.logger.error(
        `Exception in deleteCooperativeMemberApprovals for id ${id}`,
        error,
      );
      return new ErrorResponseDto(500, error);
    }
  }
}
