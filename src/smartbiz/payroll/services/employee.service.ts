/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-function-type */
import { Logger, Injectable } from '@nestjs/common';
import { ErrorResponseDto } from 'src/common/dto/error-response.dto';
import { CreateEmployeeDto } from '../dto/create/create-employee.dto';
import { UpdateEmployeeDto } from '../dto/update/update-employee.dto';
import { Employee } from '../entities/employee.entity';
import { SmartBizPostgresRest } from 'src/common/postgresrest/smart_biz_postgresrest';
// import { SmartBizPostgresRest } from 'src/common/postgresrest/smart_biz_postgresrest';

function initLogger(funcname: Function): Logger {
  return new Logger(funcname.name);
}

@Injectable()
export class EmployeesService {
  private readonly logger = initLogger(EmployeesService);
  constructor(private readonly postgresrest: SmartBizPostgresRest) {}

  async createEmployee(
    createEmployeeDto: CreateEmployeeDto,
  ): Promise<Employee | ErrorResponseDto> {
    try {
      if (
        createEmployeeDto.pobs_insurable_earnings == null ||
        createEmployeeDto.actual_insurable_earnings == null
      ) {
        return new ErrorResponseDto(403, 'Earnings cannot be null');
      }
      if (
        createEmployeeDto.pobs_insurable_earnings == 0 ||
        createEmployeeDto.actual_insurable_earnings == 0
      ) {
        return new ErrorResponseDto(403, 'Earnings cannot be 0');
      }
      if (
        createEmployeeDto.pobs_insurable_earnings !=
        createEmployeeDto.actual_insurable_earnings
      ) {
        return new ErrorResponseDto(403, 'Earnings must match');
      }
      createEmployeeDto.pobs_contribution =
        createEmployeeDto.pobs_insurable_earnings * 0.09;
      createEmployeeDto.basic_apwcs =
        createEmployeeDto.pobs_insurable_earnings * 0.0132;
      const { data, error } = await this.postgresrest
        .from('employees')
        .insert(createEmployeeDto)
        .select()
        .single();
      if (error) {
        console.log(error);
        return new ErrorResponseDto(400, error.message);
      }
      return data as Employee;
    } catch (error) {
      return new ErrorResponseDto(500, error);
    }
  }

  async findAllEmployees(): Promise<Employee[] | ErrorResponseDto> {
    try {
      const { data, error } = await this.postgresrest
        .from('employees')
        .select();

      if (error) {
        this.logger.error('Error fetching employees', error);
        return new ErrorResponseDto(400, error.message);
      }

      return data as Employee[];
    } catch (error) {
      this.logger.error('Exception in findAllEmployees', error);
      return new ErrorResponseDto(500, error);
    }
  }

  async viewEmployee(id: string): Promise<Employee | ErrorResponseDto> {
    try {
      const { data, error } = await this.postgresrest
        .from('employees')
        .select()
        .eq('id', id)
        .select()
        .single();

      if (error) {
        this.logger.error(`Error fetching employee ${id}`, error);
        return new ErrorResponseDto(400, error.message);
      }
      console.log('viewEmployee');
      console.log(data);
      console.log(typeof (data as Employee));
      const employee = new Employee();
      Object.assign(employee, data); // Copies properties from data to employee
      return employee;
    } catch (error) {
      this.logger.error(`Exception in viewEmployee for id ${id}`, error);
      return new ErrorResponseDto(500, error);
    }
  }

  async updateEmployee(
    id: string,
    updateEmployeeDto: UpdateEmployeeDto,
  ): Promise<Employee | ErrorResponseDto> {
    try {
      const { data, error } = await this.postgresrest
        .from('employees')
        .update(updateEmployeeDto)
        .eq('id', id)
        .select()
        .single();
      if (error) {
        this.logger.error(`Error updating employees ${id}`, error);
        return new ErrorResponseDto(400, error.message);
      }
      return data as Employee;
    } catch (error) {
      this.logger.error(`Exception in updateEmployee for id ${id}`, error);
      return new ErrorResponseDto(500, error);
    }
  }

  async deleteEmployee(id: string): Promise<boolean | ErrorResponseDto> {
    try {
      const { error } = await this.postgresrest
        .from('employees')
        .delete()
        .eq('id', id)
        .single();

      if (error) {
        this.logger.error(`Error deleting employee ${id}`, error);
        return new ErrorResponseDto(400, error.message);
      }

      return true;
    } catch (error) {
      this.logger.error(`Exception in deleteEmployee for id ${id}`, error);
      return new ErrorResponseDto(500, error);
    }
  }
}
