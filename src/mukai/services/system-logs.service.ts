/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-function-type */
import { Logger, Injectable } from '@nestjs/common';
import { ErrorResponseDto } from 'src/common/dto/error-response.dto';
import { PostgresRest } from 'src/common/postgresrest';
import { CreateSystemLogDto } from '../dto/create/create-system-logs.dto';
import { SystemLog } from '../entities/system-logs.entity';

function initLogger(funcname: Function): Logger {
  return new Logger(funcname.name);
}

@Injectable()
export class SystemLogsService {
  private readonly logger = initLogger(SystemLogsService);
  constructor(private readonly postgresrest: PostgresRest) {}

  async createSystemLogs(
    createSystemLogsDto: CreateSystemLogDto,
  ): Promise<SystemLog | ErrorResponseDto> {
    try {
      const { data, error } = await this.postgresrest
        .from('logs')
        .insert(createSystemLogsDto)
        .single();
      if (error) {
        this.logger.log(error);
        return new ErrorResponseDto(400, error.details);
      }
      return data as SystemLog;
    } catch (error) {
      return new ErrorResponseDto(500, error);
    }
  }

  async findAllSystemLogs(): Promise<object[] | ErrorResponseDto> {
    try {
      const { data, error } = await this.postgresrest
        .from('logs')
        .select()
        .order('created_at', { ascending: false });

      if (error) {
        this.logger.error('Error fetching logs', error);
        return new ErrorResponseDto(400, error.details);
      }

      return data as object[];
    } catch (error) {
      this.logger.error('Exception in findAllSystemLogs', error);
      return new ErrorResponseDto(500, error);
    }
  }
}
