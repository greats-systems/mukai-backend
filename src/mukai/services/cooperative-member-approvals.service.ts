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
  ): Promise<CooperativeMemberApprovals | object | ErrorResponseDto> {
    try {
      let hasSupported;
      let hasOpposed;
      // Check if the user has voted in support
      if (createCooperativeMemberApprovalsDto.supporting_votes) {
        hasSupported = await this.checkIfMemberVoted(
          createCooperativeMemberApprovalsDto.supporting_votes,
        );
      }
      // Check if the user has voted in opposition
      if (createCooperativeMemberApprovalsDto.opposing_votes) {
        hasOpposed = await this.checkIfMemberVoted(
          createCooperativeMemberApprovalsDto.opposing_votes,
        );
      }

      if (!hasSupported && !hasOpposed) {
        const { data, error } = await this.postgresrest
          .from('cooperative_member_approvals')
          .insert(createCooperativeMemberApprovalsDto)
          .select()
          .single();
        if (error) {
          console.log(error);
          return new ErrorResponseDto(400, error.message);
        }
        return data as CooperativeMemberApprovals;
      } else {
        return {
          data: `Member ${createCooperativeMemberApprovalsDto.group_id} has cast a vote already`,
        };
      }
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
    id: string,
  ): Promise<CooperativeMemberApprovals[] | ErrorResponseDto> {
    try {
      const { data, error } = await this.postgresrest
        .from('cooperative_member_approvals')
        .select()
        .eq('id', id)
        .single();

      if (error) {
        this.logger.error(`Error fetching group ${id}`, error);
        return new ErrorResponseDto(400, error.message);
      }

      return data as CooperativeMemberApprovals[];
    } catch (error) {
      this.logger.error(
        `Exception in viewCooperativeMemberApprovals for id ${id}`,
        error,
      );
      return new ErrorResponseDto(500, error);
    }
  }

  async checkIfMemberVoted(
    member_id: string[],
  ): Promise<boolean | ErrorResponseDto> {
    try {
      const { data, error } = await this.postgresrest
        .from('cooperative_member_approvals')
        .select()
        // Check if member_id exists in either array
        .or(
          `supporting_votes.cs.{${member_id}},
           opposing_votes.cs.{${member_id}},`,
        )
        .maybeSingle(); // Use maybeSingle instead of single to handle empty results

      if (error) {
        this.logger.error(
          `Error checking vote status for member ${member_id}`,
          error,
        );
        return new ErrorResponseDto(400, error.message);
      }

      // Return true if record exists (member has voted), false otherwise
      console.log(data);
      return !!data;
    } catch (error) {
      this.logger.error(
        `Exception in checkIfMemberVoted for member ${member_id.toString}`,
        error instanceof Error ? error : new Error(String(error)),
      );
      return new ErrorResponseDto(
        500,
        error instanceof Error ? error.message : 'Internal server error',
      );
    }
  }

  async updateCooperativeMemberApprovals(
    id: string,
    updateCooperativeMemberApprovalsDto: UpdateCooperativeMemberApprovalsDto,
  ): Promise<CooperativeMemberApprovals | ErrorResponseDto> {
    try {
      // const approval = await this.viewCooperativeMemberApprovals(u)
      const { data, error } = await this.postgresrest
        .from('cooperative_member_approvals')
        .update(updateCooperativeMemberApprovalsDto)
        .eq('id', id)
        .select()
        .single();
      if (error) {
        this.logger.error(
          `Error updating cooperative_member_approvals ${id}`,
          error,
        );
        return new ErrorResponseDto(400, error.message);
      }
      return data as CooperativeMemberApprovals;
    } catch (error) {
      this.logger.error(
        `Exception in updateCooperativeMemberApprovals for id ${id}`,
        error,
      );
      return new ErrorResponseDto(500, error);
    }
  }

  async updateCooperativeMemberApprovalsByCoopID(
    group_id: string,
    updateCooperativeMemberApprovalsDto: UpdateCooperativeMemberApprovalsDto,
  ): Promise<CooperativeMemberApprovals[] | ErrorResponseDto> {
    // console.log(group_id);
    // Check if member has already voted
    let hasSupported;
    let hasOpposed;

    if (updateCooperativeMemberApprovalsDto.supporting_votes) {
      hasSupported = await this.checkIfMemberVoted(
        updateCooperativeMemberApprovalsDto.supporting_votes,
      );
    }
    if (updateCooperativeMemberApprovalsDto.opposing_votes) {
      hasOpposed = await this.checkIfMemberVoted(
        updateCooperativeMemberApprovalsDto.opposing_votes,
      );
    }
    if (!hasSupported && !hasOpposed) {
      try {
        const { data, error } = await this.postgresrest
          .from('cooperative_member_approvals')
          .update(updateCooperativeMemberApprovalsDto)
          .eq('group_id', group_id)
          .eq('asset_id', updateCooperativeMemberApprovalsDto.asset_id)
          .select()
          .single();
        if (error) {
          this.logger.error(
            `Error updating cooperative_member_approvals by coop ${group_id}`,
            error,
          );
          return new ErrorResponseDto(400, error.message);
        }
        return data as CooperativeMemberApprovals[];
      } catch (error) {
        this.logger.error(
          `Exception in updateCooperativeMemberApprovals for id ${group_id}`,
          error,
        );
        return new ErrorResponseDto(500, error);
      }
    } else {
      return new ErrorResponseDto(403, 'You have already cast your vote');
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
