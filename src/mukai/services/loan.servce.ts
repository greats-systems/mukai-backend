/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-function-type */
import { Logger, Injectable } from '@nestjs/common';
import { ErrorResponseDto } from 'src/common/dto/error-response.dto';
import { PostgresRest } from 'src/common/postgresrest';
import { CreateLoanDto } from '../dto/create/create-loan.dto';
import { UpdateLoanDto } from '../dto/update/update-loan.dto';
import { Loan } from '../entities/loan.entity';

function initLogger(funcname: Function): Logger {
  return new Logger(funcname.name);
}

@Injectable()
export class LoanService {
  private readonly logger = initLogger(LoanService);
  constructor(private readonly postgresrest: PostgresRest) {}

  async createLoan(
    createLoanDto: CreateLoanDto,
  ): Promise<Loan | ErrorResponseDto> {
    try {
      const { data, error } = await this.postgresrest
        .from('loan')
        .insert(createLoanDto)
        .single();
      if (error) {
        console.log(error);
        return new ErrorResponseDto(400, error.message);
      }
      return data as Loan;
    } catch (error) {
      return new ErrorResponseDto(500, error);
    }
  }

  async findAllLoans(): Promise<Loan[] | ErrorResponseDto> {
    try {
      const { data, error } = await this.postgresrest
        .from('loan')
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
        .from('loan')
        .select()
        .eq('id', id)
        .single();

      if (error) {
        this.logger.error(`Error fetching group ${id}`, error);
        return new ErrorResponseDto(400, error.message);
      }

      return data as Loan[];
    } catch (error) {
      this.logger.error(`Exception in viewLoan for id ${id}`, error);
      return new ErrorResponseDto(500, error);
    }
  }

  async updateLoan(
    id: string,
    updateLoanDto: UpdateLoanDto,
  ): Promise<Loan | ErrorResponseDto> {
    try {
      const { data, error } = await this.postgresrest
        .from('loan')
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
        .from('loan')
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
