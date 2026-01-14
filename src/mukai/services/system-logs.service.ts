/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-function-type */
import { Logger, Injectable } from '@nestjs/common';
import { ErrorResponseDto } from 'src/common/dto/error-response.dto';
import { PostgresRest } from 'src/common/postgresrest';
import { CreateSystemLogDto } from '../dto/create/create-system-logs.dto';
import { SystemLog } from '../entities/system-logs.entity';
import { SuccessResponseDto } from 'src/common/dto/success-response.dto';

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

  async findAllSystemLogs(
    logged_in_user_id: string,
  ): Promise<SuccessResponseDto | ErrorResponseDto> {
    try {
      // Fetch data in parallel
      const [logs, logsCount] = await Promise.all([
        this.postgresrest
          .from('logs')
          .select()
          .neq('profile_id', logged_in_user_id)
          .limit(500)
          .order('created_at', { ascending: false }),
        this.postgresrest
          .from('logs')
          .select('id', { count: 'exact', head: true })
          .neq('profile_id', logged_in_user_id),
      ]);

      if (logs.error) {
        this.logger.error('Error fetching logs', logs.error);
        return new ErrorResponseDto(400, logs.error.details);
      }

      if (logsCount.error) {
        this.logger.error('Error fetching logs count', logsCount.error);
        return new ErrorResponseDto(400, logsCount.error.details);
      }

      return new SuccessResponseDto(200, 'Logs fetched successfully', {
        logs: logs.data as object[],
        logsCount: logsCount.data,
      });
    } catch (error) {
      this.logger.error('Exception in findAllSystemLogs', error);
      return new ErrorResponseDto(500, error);
    }
  }
}
