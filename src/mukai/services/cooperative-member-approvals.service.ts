/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-function-type */
import { Logger, Injectable } from '@nestjs/common';
import { ErrorResponseDto } from 'src/common/dto/error-response.dto';
import { PostgresRest } from 'src/common/postgresrest';
import { UpdateCooperativeMemberApprovalsDto } from '../dto/update/update-cooperative-member-approvals.dto';
import { CooperativeMemberApprovals } from '../entities/cooperative-member-approvals.entity';
import { CreateCooperativeMemberApprovalsDto } from '../dto/create/create-cooperative-member-approvals.dto';
import { AssetsService } from './assets.service';
import { UpdateAssetDto } from '../dto/update/update-asset.dto';
import { UUID } from 'crypto';
import { LoanService } from './loan.service';
import { UpdateLoanDto } from '../dto/update/update-loan.dto';

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
      const { data, error } = await this.postgresrest
        .from('cooperative_member_approvals')
        .upsert(createCooperativeMemberApprovalsDto, {
          onConflict: 'group_id,poll_description,asset_id',
          ignoreDuplicates: true,
        })
        .select()
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
    member_id: string,
    asset_id: string,
  ): Promise<boolean | ErrorResponseDto> {
    console.log('checkIfMemberVoted');
    console.log(member_id);
    try {
      const { data, error } = await this.postgresrest
        .from('cooperative_member_approvals')
        .select()
        .eq('asset_id', asset_id)
        .or(
          `supporting_votes.cs.{${member_id}},opposing_votes.cs.{${member_id}}`,
        );

      if (error) {
        this.logger.error(
          `Error checking vote status for member ${member_id.toString()}`,
          error,
        );
        return new ErrorResponseDto(400, error.message);
      }

      // Return true if record exists (member has voted), false otherwise
      console.log('Checking if member voted');
      if (data.length === 0) {
        console.log(data.length);
        return false;
      }
      // console.log(!data);
      return true;
    } catch (error) {
      this.logger.error(
        `Exception in checkIfMemberVoted for member ${member_id.toString()}`,
        error instanceof Error ? error : new Error(String(error)),
      );
      return new ErrorResponseDto(
        500,
        error instanceof Error ? error.message : 'Internal server error',
      );
    }
  }

  async checkIfMemberSupported(
    member_id: string,
    asset_id: string,
  ): Promise<boolean | ErrorResponseDto> {
    console.log('checkIfMemberSupported');
    console.log(member_id);
    try {
      const { data, error } = await this.postgresrest
        .from('cooperative_member_approvals')
        .select()
        .contains('supporting_votes', [member_id])
        .eq('asset_id', asset_id); // Use maybeSingle instead of single to handle empty results

      if (error) {
        this.logger.error(
          `Error checking vote status for member ${member_id.toString()}`,
          error,
        );
        return new ErrorResponseDto(400, error.message);
      }

      // Return true if record exists (member has voted), false otherwise
      console.log('Checking if member voted');
      if (data.length === 0) {
        console.log(data.length);
        return false;
      }
      // console.log(!data);
      return true;
    } catch (error) {
      this.logger.error(
        `Exception in checkIfMemberVoted for member ${member_id.toString()}`,
        error instanceof Error ? error : new Error(String(error)),
      );
      return new ErrorResponseDto(
        500,
        error instanceof Error ? error.message : 'Internal server error',
      );
    }
  }

  async checkIfMemberOpposed(
    member_id: string,
    asset_id: string,
  ): Promise<boolean | ErrorResponseDto> {
    console.log('checkIfMemberOpposed');
    console.log(member_id);
    try {
      const { data, error } = await this.postgresrest
        .from('cooperative_member_approvals')
        .select()
        .contains('opposing_votes', [member_id])
        .eq('asset_id', asset_id); // Use maybeSingle instead of single to handle empty results

      if (error) {
        this.logger.error(
          `Error checking vote status for member ${member_id.toString()}`,
          error,
        );
        return new ErrorResponseDto(400, error.message);
      }

      // Return true if record exists (member has voted), false otherwise
      console.log('Checking if member voted');
      if (data.length === 0) {
        console.log(data.length);
        return false;
      }
      // console.log(!data);
      return true;
    } catch (error) {
      this.logger.error(
        `Exception in checkIfMemberVoted for member ${member_id.toString()}`,
        error instanceof Error ? error : new Error(String(error)),
      );
      return new ErrorResponseDto(
        500,
        error instanceof Error ? error.message : 'Internal server error',
      );
    }
  }

  async checkIfMemberVotedLoan(
    member_id: string,
    loan_id: string,
  ): Promise<boolean | ErrorResponseDto> {
    console.log('checkIfMemberVotedLoan');
    console.log(member_id);
    try {
      const { data, error } = await this.postgresrest
        .from('cooperative_member_approvals')
        .select()
        .eq('loan_id', loan_id)
        .or(
          `supporting_votes.cs.{${member_id}},opposing_votes.cs.{${member_id}}`,
        );

      if (error) {
        this.logger.error(
          `Error checking vote status for member ${member_id.toString()}`,
          error,
        );
        return new ErrorResponseDto(400, error.message);
      }

      // Return true if record exists (member has voted), false otherwise
      console.log('Checking if member voted for loan');
      if (data.length === 0) {
        console.log(data.length);
        return false;
      }
      // console.log(!data);
      return true;
    } catch (error) {
      this.logger.error(
        `Exception in checkIfMemberVoted for member ${member_id.toString()}`,
        error instanceof Error ? error : new Error(String(error)),
      );
      return new ErrorResponseDto(
        500,
        error instanceof Error ? error.message : 'Internal server error',
      );
    }
  }

  async checkIfMemberSupportedLoan(
    member_id: string,
    loan_id: string,
  ): Promise<boolean | ErrorResponseDto> {
    console.log('checkIfMemberSupportedLoan');
    console.log(member_id);
    try {
      const { data, error } = await this.postgresrest
        .from('cooperative_member_approvals')
        .select()
        .contains('supporting_votes', [member_id])
        .eq('loan_id', loan_id); // Use maybeSingle instead of single to handle empty results

      if (error) {
        this.logger.error(
          `Error checking vote status for member ${member_id.toString()}`,
          error,
        );
        return new ErrorResponseDto(400, error.message);
      }

      // Return true if record exists (member has voted), false otherwise
      console.log('Checking if member voted');
      if (data.length === 0) {
        console.log(data.length);
        return false;
      }
      // console.log(!data);
      return true;
    } catch (error) {
      this.logger.error(
        `Exception in checkIfMemberVoted for member ${member_id.toString()}`,
        error instanceof Error ? error : new Error(String(error)),
      );
      return new ErrorResponseDto(
        500,
        error instanceof Error ? error.message : 'Internal server error',
      );
    }
  }

  async checkIfMemberOpposedLoan(
    member_id: string,
    loan_id: string,
  ): Promise<boolean | ErrorResponseDto> {
    console.log('checkIfMemberOpposedLoan');
    console.log(member_id);
    try {
      const { data, error } = await this.postgresrest
        .from('cooperative_member_approvals')
        .select()
        .contains('opposing_votes', [member_id])
        .eq('loan_id', loan_id); // Use maybeSingle instead of single to handle empty results

      if (error) {
        this.logger.error(
          `Error checking vote status for member ${member_id.toString()}`,
          error,
        );
        return new ErrorResponseDto(400, error.message);
      }

      // Return true if record exists (member has voted), false otherwise
      console.log('Checking if member opposed loan');
      if (data.length === 0) {
        console.log(data.length);
        return false;
      }
      // console.log(!data);
      return true;
    } catch (error) {
      this.logger.error(
        `Exception in checkIfMemberVoted for member ${member_id.toString()}`,
        error instanceof Error ? error : new Error(String(error)),
      );
      return new ErrorResponseDto(
        500,
        error instanceof Error ? error.message : 'Internal server error',
      );
    }
  }

  private async checkVoteStatus(
    member_id: string,
    filter: { asset_id?: string; loan_id?: string },
    voteType?: 'supporting' | 'opposing',
  ): Promise<boolean | ErrorResponseDto> {
    try {
      if (!filter.asset_id && !filter.loan_id) {
        throw new Error('Either asset_id or loan_id must be provided');
      }

      let query = this.postgresrest
        .from('cooperative_member_approvals')
        .select();

      // Apply filters
      if (filter.asset_id) {
        query = query.eq('asset_id', filter.asset_id);
      }
      if (filter.loan_id) {
        query = query.eq('loan_id', filter.loan_id);
      }

      // Apply vote type filter if specified
      if (voteType) {
        const column =
          voteType === 'supporting' ? 'supporting_votes' : 'opposing_votes';
        query = query.contains(column, [member_id]);
      } else {
        // For general vote check, look in either array
        query = query.or(
          `supporting_votes.cs.{${member_id}},opposing_votes.cs.{${member_id}}`,
        );
      }

      const { data, error } = await query;

      if (error) {
        this.logger.error(
          `Error checking vote status for member ${member_id}`,
          error,
        );
        return new ErrorResponseDto(400, error.message);
      }

      return data.length > 0;
    } catch (error) {
      this.logger.error(
        `Exception in vote check for member ${member_id}`,
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
      console.log(updateCooperativeMemberApprovalsDto);
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
  ): Promise<CooperativeMemberApprovals[] | null | object | ErrorResponseDto> {
    // console.log(group_id);
    // Check if member has already voted
    let hasVotedBefore;
    let hasSupported;
    let hasOpposed;
    const assetsService = new AssetsService(this.postgresrest);
    const updateAssetsDto = new UpdateAssetDto();

    if (updateCooperativeMemberApprovalsDto.supporting_votes) {
      hasVotedBefore = await this.checkIfMemberVoted(
        updateCooperativeMemberApprovalsDto.supporting_votes,
        updateCooperativeMemberApprovalsDto.asset_id!,
      );
      hasSupported = await this.checkIfMemberSupported(
        updateCooperativeMemberApprovalsDto.supporting_votes,
        updateCooperativeMemberApprovalsDto.asset_id!,
      );
    }
    if (updateCooperativeMemberApprovalsDto.opposing_votes) {
      hasVotedBefore = await this.checkIfMemberVoted(
        updateCooperativeMemberApprovalsDto.opposing_votes,
        updateCooperativeMemberApprovalsDto.asset_id!,
      );
      hasOpposed = await this.checkIfMemberOpposed(
        updateCooperativeMemberApprovalsDto.opposing_votes,
        updateCooperativeMemberApprovalsDto.asset_id!,
      );
    }
    console.log('Voted?');
    console.log(hasVotedBefore);
    console.log('Supported?');
    console.log(hasSupported);
    console.log('Opposed?');
    console.log(hasOpposed);
    if (
      (!hasVotedBefore || hasVotedBefore == undefined) &&
      (!hasSupported || hasSupported == undefined) &&
      (!hasOpposed || hasOpposed == undefined)
    ) {
      console.log('This user has not voted yet');
      console.log(updateCooperativeMemberApprovalsDto);
      try {
        let data;

        // Conditionally append to supporting_votes if provided
        if (updateCooperativeMemberApprovalsDto.supporting_votes) {
          console.log(updateCooperativeMemberApprovalsDto.supporting_votes);
          console.log(
            typeof updateCooperativeMemberApprovalsDto.supporting_votes,
          );
          // Get the first member ID if it's an array, or use the value directly
          const memberId = Array.isArray(
            updateCooperativeMemberApprovalsDto.supporting_votes,
          )
            ? updateCooperativeMemberApprovalsDto.supporting_votes[0]
            : updateCooperativeMemberApprovalsDto.supporting_votes;

          data = await this.postgresrest.rpc('add_supporting_vote', {
            p_group_id: group_id,
            p_asset_id: updateCooperativeMemberApprovalsDto.asset_id,
            p_member_id: memberId, // No .toString() needed if it's already a UUID string
          });
          console.log(data);

          if (data.error) {
            this.logger.error(
              `Error adding supporting vote: ${data.error.message},`,
            );
            return new ErrorResponseDto(400, data.error.message);
          }
        }

        // Conditionally append to opposing_votes if provided
        if (updateCooperativeMemberApprovalsDto.opposing_votes) {
          const memberId = Array.isArray(
            updateCooperativeMemberApprovalsDto.opposing_votes,
          )
            ? updateCooperativeMemberApprovalsDto.opposing_votes[0]
            : updateCooperativeMemberApprovalsDto.opposing_votes;

          data = await this.postgresrest.rpc('add_opposing_vote', {
            p_group_id: group_id,
            p_asset_id: updateCooperativeMemberApprovalsDto.asset_id,
            p_member_id: memberId,
          });

          if (data.error) {
            this.logger.error(
              `Error adding opposing vote: ${data.error.message}`,
            );
            return new ErrorResponseDto(400, data.error.message);
          }
        }

        // Update asset status
        updateAssetsDto.id = updateCooperativeMemberApprovalsDto.asset_id;
        updateAssetsDto.has_received_vote = true;
        await assetsService.updateAsset(updateAssetsDto.id!, updateAssetsDto);
        return data as UpdateCooperativeMemberApprovalsDto;
      } catch (error) {
        this.logger.error(
          `Exception in updateCooperativeMemberApprovals for id ${group_id}`,
          error,
        );
        return new ErrorResponseDto(500, error);
      }
    } else {
      console.log('This user has voted before');
      return { data: 'You have voted already' };
    }
  }

  async updateCooperativeMemberApprovalsLoanByCoopID(
    group_id: string,
    updateCooperativeMemberApprovalsDto: UpdateCooperativeMemberApprovalsDto,
  ): Promise<CooperativeMemberApprovals[] | null | object | ErrorResponseDto> {
    // console.log(group_id);
    // Check if member has already voted
    let hasVotedBefore;
    let hasSupported;
    let hasOpposed;
    const loanService = new LoanService(this.postgresrest);
    const updateLoanDto = new UpdateLoanDto();

    if (updateCooperativeMemberApprovalsDto.supporting_votes) {
      hasVotedBefore = await this.checkIfMemberVotedLoan(
        updateCooperativeMemberApprovalsDto.supporting_votes,
        updateCooperativeMemberApprovalsDto.loan_id!,
      );
      hasSupported = await this.checkIfMemberSupportedLoan(
        updateCooperativeMemberApprovalsDto.supporting_votes,
        updateCooperativeMemberApprovalsDto.loan_id!,
      );
    }
    if (updateCooperativeMemberApprovalsDto.opposing_votes) {
      hasVotedBefore = await this.checkIfMemberVotedLoan(
        updateCooperativeMemberApprovalsDto.opposing_votes,
        updateCooperativeMemberApprovalsDto.loan_id!,
      );
      hasOpposed = await this.checkIfMemberOpposedLoan(
        updateCooperativeMemberApprovalsDto.opposing_votes,
        updateCooperativeMemberApprovalsDto.loan_id!,
      );
    }
    console.log('Voted?');
    console.log(hasVotedBefore);
    console.log('Supported?');
    console.log(hasSupported);
    console.log('Opposed?');
    console.log(hasOpposed);
    if (
      (!hasVotedBefore || hasVotedBefore == undefined) &&
      (!hasSupported || hasSupported == undefined) &&
      (!hasOpposed || hasOpposed == undefined)
    ) {
      console.log('This user has not voted yet');
      console.log(updateCooperativeMemberApprovalsDto);
      try {
        let data;

        // Conditionally append to supporting_votes if provided
        if (updateCooperativeMemberApprovalsDto.supporting_votes) {
          console.log(updateCooperativeMemberApprovalsDto.supporting_votes);
          console.log(
            typeof updateCooperativeMemberApprovalsDto.supporting_votes,
          );
          // Get the first member ID if it's an array, or use the value directly
          const memberId = Array.isArray(
            updateCooperativeMemberApprovalsDto.supporting_votes,
          )
            ? updateCooperativeMemberApprovalsDto.supporting_votes[0]
            : updateCooperativeMemberApprovalsDto.supporting_votes;

          data = await this.postgresrest.rpc('add_loan_supporting_vote', {
            p_group_id: group_id,
            p_loan_id: updateCooperativeMemberApprovalsDto.loan_id,
            p_member_id: memberId, // No .toString() needed if it's already a UUID string
          });
          console.log(data);

          if (data.error) {
            this.logger.error(
              `Error adding supporting vote: ${data.error.message},`,
            );
            return new ErrorResponseDto(400, data.error.message);
          }
        }

        // Conditionally append to opposing_votes if provided
        if (updateCooperativeMemberApprovalsDto.opposing_votes) {
          const memberId = Array.isArray(
            updateCooperativeMemberApprovalsDto.opposing_votes,
          )
            ? updateCooperativeMemberApprovalsDto.opposing_votes[0]
            : updateCooperativeMemberApprovalsDto.opposing_votes;

          data = await this.postgresrest.rpc('add_loan_opposing_vote', {
            p_group_id: group_id,
            p_loan_id: updateCooperativeMemberApprovalsDto.loan_id,
            p_member_id: memberId,
          });

          if (data.error) {
            this.logger.error(
              `Error adding opposing vote: ${data.error.message}`,
            );
            return new ErrorResponseDto(400, data.error.message);
          }
        }

        // Update loan status
        updateLoanDto.id = updateCooperativeMemberApprovalsDto.loan_id;
        updateLoanDto.has_received_vote = true;
        console.log('updateLoanDto');
        console.log(updateLoanDto);
        await loanService.updateLoan(updateLoanDto.id!, updateLoanDto);
        return data as UpdateCooperativeMemberApprovalsDto;
      } catch (error) {
        this.logger.error(
          `Exception in updateCooperativeMemberApprovals for id ${group_id}`,
          error,
        );
        return new ErrorResponseDto(500, error);
      }
    } else {
      console.log('This user has voted before');
      return { data: 'You have voted already' };
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
