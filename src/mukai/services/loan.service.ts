/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-function-type */
import { Logger, Injectable } from '@nestjs/common';
import { ErrorResponseDto } from 'src/common/dto/error-response.dto';
import { PostgresRest } from 'src/common/postgresrest';
import { CreateLoanDto } from '../dto/create/create-loan.dto';
import { UpdateLoanDto } from '../dto/update/update-loan.dto';
import { Loan } from '../entities/loan.entity';
import { DateTime } from 'luxon';
import { v4 as uuidv4 } from 'uuid';

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
    // const maService = new CooperativeMemberApprovalsService(this.postgresrest);
    // const maDto = new CreateCooperativeMemberApprovalsDto();
    try {
      createLoanDto.id = createLoanDto.id || uuidv4();
      createLoanDto.created_at = DateTime.now().toISO();
      /*
      // Check if the user has an existing loan
      const hasActiveLoan = await this.hasActiveLoan(createLoanDto);
      if (hasActiveLoan instanceof ErrorResponseDto) {
        return hasActiveLoan;
      }
      */
      this.logger.warn('Create loan dto', createLoanDto);
      const { data: loanResponse, error } = await this.postgresrest
        .from('loans')
        .insert(createLoanDto)
        .select()
        .single();
      if (error) {
        this.logger.log(error);
        return new ErrorResponseDto(400, error.details);
      }
      return loanResponse as Loan;
      // Accept the loan request if the applicant does not have active loans
      /*
      if (!hasActiveLoan) {
        const { data: loanResponse, error } = await this.postgresrest
          .from('loans')
          .insert(createLoanDto)
          .select()
          .single();
        if (error) {
          this.logger.log(error);
          return new ErrorResponseDto(400, error.details);
        }
        return loanResponse as Loan;
      } else {
        return new ErrorResponseDto(
          403,
          `User ${createLoanDto.profile_id} has an active loan and cannot apply for another one`,
        );
      }
      */
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
        this.logger.error('Error fetching loans', error);
        return new ErrorResponseDto(400, error.details);
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
        return new ErrorResponseDto(400, error.details);
      }

      return data as Loan[];
    } catch (error) {
      this.logger.error(`Exception in viewLoan for id ${id}`, error);
      return new ErrorResponseDto(500, error);
    }
  }

  async hasActiveLoan(
    loanDto: CreateLoanDto,
  ): Promise<boolean | ErrorResponseDto> {
    try {
      this.logger.debug(JSON.stringify(loanDto));
      const { data, error } = await this.postgresrest
        .from('loans')
        .select()
        .eq('profile_id', loanDto.profile_id)
        .eq('cooperative_id', loanDto.cooperative_id)
        .eq('status', 'disbursed')
        .maybeSingle();

      if (error) {
        this.logger.error(`Error checking active loan ${loanDto.id}`, error);
        if (error.details == 'The result contains 0 rows') {
          return false; // No active loan found
        }
        return new ErrorResponseDto(400, error.details);
      }
      this.logger.log(`active loan data: ${JSON.stringify(data)}`);
      if (data != null) {
        return true;
      }
      return false;
    } catch (error) {
      this.logger.error(`Exception in viewLoan for id ${loanDto.id}`, error);
      return new ErrorResponseDto(500, error);
    }
  }

  async viewProfileLoans(
    profile_id: string,
  ): Promise<Loan[] | ErrorResponseDto> {
    try {
      const { data, error } = await this.postgresrest
        .from('loans')
        .select()
        .eq('profile_id', profile_id);
      // .single();

      if (error) {
        this.logger.error(
          `Error fetching loan for profile ${profile_id}`,
          error,
        );
        return new ErrorResponseDto(400, error.details);
      }

      return data as Loan[];
    } catch (error) {
      this.logger.error(`Exception in viewLoan for id ${profile_id}`, error);
      return new ErrorResponseDto(500, error);
    }
  }

  async viewCoopLoans(
    cooperative_id: string,
    // profile_id: string,
  ): Promise<Loan[] | ErrorResponseDto> {
    // this.logger.debug(`viewCoopLoans profile_id ${profile_id}`);
    try {
      const { data, error } = await this.postgresrest
        .from('loans')
        .select()
        .eq('cooperative_id', cooperative_id);
      // .neq('profile_id', profile_id);
      // .single();

      if (error) {
        this.logger.error(
          `Error fetching loan for coop ${cooperative_id}`,
          error,
        );
        return new ErrorResponseDto(400, error.details);
      }
      this.logger.debug(`viewCoopLoans data: ${JSON.stringify(data)}`);
      return data as Loan[];
    } catch (error) {
      this.logger.error(
        `Exception in viewLoan for id ${cooperative_id}`,
        error,
      );
      return new ErrorResponseDto(500, error);
    }
  }

  async viewPendingLoan(
    cooperative_id: string,
    profile_id: string,
  ): Promise<Loan[] | ErrorResponseDto> {
    try {
      const { data, error } = await this.postgresrest
        .from('loans')
        .select()
        .eq('cooperative_id', cooperative_id)
        .neq('profile_id', profile_id);
      // .single();

      if (error) {
        this.logger.error(
          `Error fetching loan for coop ${cooperative_id}`,
          error,
        );
        return new ErrorResponseDto(400, error.details);
      }

      return data as Loan[];
    } catch (error) {
      this.logger.error(
        `Exception in viewLoan for id ${cooperative_id}`,
        error,
      );
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
        return new ErrorResponseDto(400, error.details);
      }
      return data as Loan;
    } catch (error) {
      this.logger.error(`Exception in updateLoan for id ${id}`, error);
      return new ErrorResponseDto(500, error);
    }
  }

  async updateCoop(
    cooperative_id: string,
    updateLoanDto: UpdateLoanDto,
  ): Promise<Loan[] | ErrorResponseDto> {
    try {
      const { data, error } = await this.postgresrest
        .from('loans')
        .update({
          interest_rate: updateLoanDto.interest_rate,
        })
        .eq('cooperative_id', cooperative_id)
        .select();
      // .single();
      if (error) {
        this.logger.error(`Error updating coop loan ${cooperative_id}`, error);
        return new ErrorResponseDto(400, error.details);
      }
      return data as Loan[];
    } catch (error) {
      this.logger.error(
        `Exception in updateLoan for id ${cooperative_id}`,
        error,
      );
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
        return new ErrorResponseDto(400, error.details);
      }

      return true;
    } catch (error) {
      this.logger.error(`Exception in deleteLoan for id ${id}`, error);
      return new ErrorResponseDto(500, error);
    }
  }
}
