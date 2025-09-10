/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-function-type */
import { Logger, Injectable } from '@nestjs/common';
import { ErrorResponseDto } from 'src/common/dto/error-response.dto';
// import { SmartBizPostgresRest } from 'src/common/postgresrest/smart_biz_postgresrest';
import { CreatePayslipDto } from '../dto/create/create-payslip.dto';
import { Payslip } from '../entities/payslip.entity';
import { PayrollSummary } from '../entities/payroll-summary.entity';
import { EmployeesService } from './employee.service';
import { Employee } from '../entities/employee.entity';
import { SmartBizPostgresRest } from 'src/common/postgresrest/smart_biz_postgresrest';

function initLogger(funcname: Function): Logger {
  return new Logger(funcname.name);
}

@Injectable()
export class PayslipsService {
  private readonly logger = initLogger(PayslipsService);
  constructor(private readonly postgresrest: SmartBizPostgresRest) {}

  async employeeExists(
    employee_id: string,
  ): Promise<boolean | ErrorResponseDto> {
    const employeeService = new EmployeesService(this.postgresrest);
    const employeeResponse = await employeeService.viewEmployee(employee_id);
    this.logger.log('employeeExists');
    this.logger.log(typeof employeeResponse);
    this.logger.log(employeeResponse instanceof Employee);
    try {
      if (employeeResponse instanceof ErrorResponseDto) {
        this.logger.error(
          `Error checking employee: ${employeeResponse.message}`,
        );
        return new ErrorResponseDto(400, employeeResponse.message);
      }
      if (employeeResponse instanceof Employee) {
        return true;
      }
    } catch (error) {
      this.logger.error(`Error checking employee: ${error}`);
      return new ErrorResponseDto(500, error);
    }
    return false;
  }

  async payslipForPeriodExists(
    employee_id: string,
    month: string,
    year: number,
  ): Promise<boolean | ErrorResponseDto> {
    try {
      const payslipResponse = await this.viewPayslipForPeriod(
        employee_id,
        month,
        year,
      );
      if (payslipResponse instanceof ErrorResponseDto) {
        this.logger.error(`Error checking payslip for employee ${employee_id}`);
        return new ErrorResponseDto(400, payslipResponse.message);
      }
      if (payslipResponse instanceof Payslip) {
        return true;
      }
      return false;
    } catch (error) {
      return new ErrorResponseDto(500, error);
    }
  }
  async createPayslip(
    createPayslipDto: CreatePayslipDto,
  ): Promise<Payslip | object | ErrorResponseDto> {
    try {
      const employeeExists = await this.employeeExists(
        createPayslipDto.employee_id!,
      );
      const payslipExists = await this.payslipForPeriodExists(
        createPayslipDto.employee_id!,
        createPayslipDto.month!,
        createPayslipDto.year!,
      );
      if (employeeExists) {
        if (!payslipExists) {
          createPayslipDto.gross_pay =
            createPayslipDto.base_pay! +
            createPayslipDto.housing_allowance! +
            createPayslipDto.transport_allowance! +
            createPayslipDto.commission!;

          createPayslipDto.nssa_levy_usd = this.calculateNssaDeductions(
            createPayslipDto.base_pay!,
          );
          const taxableIncome =
            createPayslipDto.gross_pay - createPayslipDto.nssa_levy_usd;
          createPayslipDto.paye_usd = this.calculatePaye(taxableIncome);
          createPayslipDto.aids_levy_usd = createPayslipDto.paye_usd * 0.03;
          createPayslipDto.total_deductions_usd =
            createPayslipDto.paye_usd +
            createPayslipDto.aids_levy_usd +
            createPayslipDto.nssa_levy_usd;
          createPayslipDto.net_pay_usd =
            createPayslipDto.gross_pay - createPayslipDto.total_deductions_usd;

          const { data, error } = await this.postgresrest
            .from('payslips')
            .insert(createPayslipDto)
            .select()
            .single();
          if (error) {
            this.logger.log(error);
            return new ErrorResponseDto(400, error.details);
          }
          return data as Payslip;
        } else {
          return new ErrorResponseDto(
            403,
            `Employee ${createPayslipDto.employee_id} already has a payslip for ${createPayslipDto.month!} ${createPayslipDto.year!}`,
          );
        }
      } else {
        return new ErrorResponseDto(404, 'Employee not found');
      }
    } catch (error) {
      return new ErrorResponseDto(500, error);
    }
  }

  calculateNssaDeductions(basePay: number) {
    let nssaPension = 0;
    if (basePay * 0.045 > 700) {
      nssaPension = 700;
    } else {
      nssaPension = basePay * 0.045;
    }
    return nssaPension;
  }

  calculatePaye(taxableIncome: number) {
    let paye = 0;
    switch (true) {
      case taxableIncome >= 0 && taxableIncome <= 100:
        paye = 0;
        break;
      case taxableIncome >= 100.01 && taxableIncome <= 300:
        paye = taxableIncome * 0.2 - 20;
        break;
      case taxableIncome >= 300.01 && taxableIncome <= 1000:
        paye = taxableIncome * 0.25 - 35;
        break;
      case taxableIncome >= 1000.01 && taxableIncome <= 2000:
        paye = taxableIncome * 0.3 - 85;
        break;
      case taxableIncome >= 2000.01 && taxableIncome <= 3000:
        paye = taxableIncome * 0.35 - 185;
        break;
      case taxableIncome >= 3000.01:
        paye = taxableIncome * 0.4 - 335;
        break;
    }
    return paye;
  }

  async findAllPayslips(): Promise<Payslip[] | ErrorResponseDto> {
    try {
      const { data, error } = await this.postgresrest.from('payslips').select();

      if (error) {
        this.logger.error('Error fetching payslips', error);
        return new ErrorResponseDto(400, error.details);
      }

      return data as Payslip[];
    } catch (error) {
      this.logger.error('Exception in findAllPayslips', error);
      return new ErrorResponseDto(500, error);
    }
  }

  async viewPayslip(id: string): Promise<Payslip[] | ErrorResponseDto> {
    try {
      const { data, error } = await this.postgresrest
        .from('payslips')
        .select()
        .eq('id', id)
        .single();

      if (error) {
        this.logger.error(`Error fetching employee_id ${id}`, error);
        return new ErrorResponseDto(400, error.details);
      }

      return data as Payslip[];
    } catch (error) {
      this.logger.error(`Exception in viewPayslip for id ${id}`, error);
      return new ErrorResponseDto(500, error);
    }
  }

  async viewPayslipForPeriod(
    employee_id: string,
    month: string,
    year: number,
  ): Promise<Payslip | null | ErrorResponseDto> {
    try {
      const { data, error } = await this.postgresrest
        .from('payslips')
        .select()
        .eq('employee_id', employee_id)
        .eq('month', month)
        .eq('year', year)
        .single();

      if (error) {
        this.logger.error(
          `Error fetching employee_id ${employee_id} for ${month} ${year}`,
          error,
        );
        if (error.details == 'The result contains 0 rows') {
          return null;
        }
        return new ErrorResponseDto(400, error.details);
      }
      const payslip = new Payslip();
      Object.assign(payslip, data);
      this.logger.log(payslip);
      return payslip;
    } catch (error) {
      this.logger.error(
        `Exception in viewPayslipForPeriod for id ${employee_id}`,
        error,
      );
      return new ErrorResponseDto(500, error);
    }
  }

  async viewPayrollSummary(): Promise<PayrollSummary[] | ErrorResponseDto> {
    try {
      // Single query with all aggregations
      const { data, error } = await this.postgresrest.rpc(
        'generate_payroll_report',
      );

      if (error) {
        this.logger.error('Error in createPayrollSummary', { error });
        return new ErrorResponseDto(400, 'Failed to generate payroll summary');
      }

      if (!data || data.length === 0) {
        return [];
      }

      return data as unknown as PayrollSummary[];
    } catch (error) {
      this.logger.error('Unexpected error in createPayrollSummary', { error });
      return new ErrorResponseDto(500, 'Internal server error');
    }
  }
}
