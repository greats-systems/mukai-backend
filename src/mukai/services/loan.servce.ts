/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-function-type */
import { Logger, Injectable } from '@nestjs/common';
import { ErrorResponseDto } from 'src/common/dto/error-response.dto';
import { PostgresRest } from 'src/common/postgresrest';
import { CreateLoanDto } from '../dto/create/create-loan.dto';
import { UpdateLoanDto } from '../dto/update/update-loan.dto';
import { Loan } from '../entities/loan.entity';
import { CooperativeMemberApprovalsService } from './cooperative-member-approvals.service';
import { CreateCooperativeMemberApprovalsDto } from '../dto/create/create-cooperative-member-approvals.dto';
import uuidv4 from 'supabase/apps/studio/lib/uuid';
import { DateTime } from 'luxon';

function initLogger(funcname: Function): Logger {
  return new Logger(funcname.name);
}

@Injectable()
export class LoanService {
  private readonly logger = initLogger(LoanService);
  constructor(private readonly postgresrest: PostgresRest) {}

  calculateRepayAmount(principalAmount: number, loanTermMonths: number) {
    const principal = principalAmount ?? 0;
    const months = loanTermMonths ?? 0;

    if (principal <= 0 || months <= 0) {
      // paymentAmount = 0;
      return;
    }

    const monthlyRate = 0.02; // 2% monthly interest
    // monthlyRate**months
    const repayAmount = principal * (1 + monthlyRate) ** months;
    return repayAmount;
  }

  calculateDueDate(months: number): Date {
    if (months <= 0) throw new Error('Term must be positive');

    const today = DateTime.now();
    const dueDate = today.plus({ months: Math.round(months) }); // Handles year rollover automatically

    return dueDate.toJSDate(); // Convert to JavaScript Date if needed
  }

  async createLoan(
    createLoanDto: CreateLoanDto,
  ): Promise<Loan | ErrorResponseDto> {
    const maService = new CooperativeMemberApprovalsService(this.postgresrest);
    const maDto = new CreateCooperativeMemberApprovalsDto();
    try {
      createLoanDto.id = createLoanDto.id || uuidv4();
      createLoanDto.due_date = this.calculateDueDate(
        createLoanDto.loan_term_months!,
      );
      const { data: loanResponse, error } = await this.postgresrest
        .from('loans')
        .insert(createLoanDto)
        .select()
        .single();
      if (error) {
        console.log(error);
        return new ErrorResponseDto(400, error.message);
      }
      maDto.group_id = createLoanDto.cooperative_id;
      maDto.poll_description = 'loan application';
      maDto.loan_id = createLoanDto.id;
      const maResponse =
        await maService.createCooperativeMemberApprovals(maDto);
      console.log(maResponse);
      return loanResponse as Loan;
    } catch (error) {
      return new ErrorResponseDto(500, error);
    }
  }

  async findAllLoans(): Promise<Loan[] | ErrorResponseDto> {
    try {
      const { data, error } = await this.postgresrest
        .from('loans')
        .select()
        .order('created_at', { ascending: false });

      if (error) {
        this.logger.error('Error fetching loan', error);
        return new ErrorResponseDto(400, error.message);
      }

      return data as Loan[];
    } catch (error) {
      this.logger.error('Exception in findAllLoan', error);
      return new ErrorResponseDto(500, error);
    }
  }

  async viewLoan(id: string): Promise<Loan[] | ErrorResponseDto> {
    try {
      const { data, error } = await this.postgresrest
        .from('loans')
        .select()
        .eq('id', id)
        .single();

      if (error) {
        this.logger.error(`Error fetching loan ${id}`, error);
        return new ErrorResponseDto(400, error.message);
      }

      return data as Loan[];
    } catch (error) {
      this.logger.error(`Exception in viewLoan for id ${id}`, error);
      return new ErrorResponseDto(500, error);
    }
  }

  async viewProfileLoan(
    profile_id: string,
  ): Promise<Loan[] | ErrorResponseDto> {
    try {
      const { data, error } = await this.postgresrest
        .from('loans')
        .select()
        .eq('profile_id', profile_id);
      // .single();

      if (error) {
        this.logger.error(`Error fetching loan for ${profile_id}`, error);
        return new ErrorResponseDto(400, error.message);
      }

      return data as Loan[];
    } catch (error) {
      this.logger.error(`Exception in viewLoan for id ${profile_id}`, error);
      return new ErrorResponseDto(500, error);
    }
  }

  async updateLoan(
    id: string,
    updateLoanDto: UpdateLoanDto,
  ): Promise<Loan | ErrorResponseDto> {
    try {
      const { data, error } = await this.postgresrest
        .from('loans')
        .update(updateLoanDto)
        .eq('id', id)
        .select()
        .single();
      if (error) {
        this.logger.error(`Error updating loan ${id}`, error);
        return new ErrorResponseDto(400, error.message);
      }
      return data as Loan;
    } catch (error) {
      this.logger.error(`Exception in updateLoan for id ${id}`, error);
      return new ErrorResponseDto(500, error);
    }
  }

  async deleteLoan(id: string): Promise<boolean | ErrorResponseDto> {
    try {
      const { error } = await this.postgresrest
        .from('loans')
        .delete()
        .eq('id', id)
        .single();

      if (error) {
        this.logger.error(`Error deleting group ${id}`, error);
        return new ErrorResponseDto(400, error.message);
      }

      return true;
    } catch (error) {
      this.logger.error(`Exception in deleteLoan for id ${id}`, error);
      return new ErrorResponseDto(500, error);
    }
  }
}
