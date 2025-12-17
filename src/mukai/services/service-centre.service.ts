/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable, Logger } from '@nestjs/common';
import { ErrorResponseDto } from 'src/common/dto/error-response.dto';
import { SuccessResponseDto } from 'src/common/dto/success-response.dto';
import { PostgresRest } from 'src/common/postgresrest';
import { CreateSystemLogDto } from '../dto/create/create-system-logs.dto';
import { SystemLogsService } from './system-logs.service';

@Injectable()
export class ServiceCentreService {
  private readonly logger = new Logger(ServiceCentreService.name);
  constructor(
    private readonly postgresrest: PostgresRest,
    private readonly slService: SystemLogsService,
  ) {}

  async getAllServiceCentres(
    logged_in_user_id: string,
    platform: string,
  ): Promise<SuccessResponseDto | ErrorResponseDto> {
    const slDto = new CreateSystemLogDto();
    slDto.profile_id = logged_in_user_id;
    slDto.platform = platform;
    slDto.action = 'fetch all service centres';
    const { data, error } = await this.postgresrest
      .from('service_centres')
      .select()
      .order('location', { ascending: true });
    if (error) {
      slDto.response = error;
      await this.slService.createSystemLogs(slDto);
      this.logger.error(`Error fetching service centres: ${error.message}`);
      return new ErrorResponseDto(
        400,
        'Failed to fetch service centres',
        error,
      );
    }
    slDto.response = {
      statusCode: 200,
      message: 'Service centres fetched successfully',
    };
    await this.slService.createSystemLogs(slDto);
    return new SuccessResponseDto(
      200,
      'Service centres fetched successfully',
      data,
    );
  }

  async getServiceCentre(
    id: string,
    logged_in_user_id: string,
    platform: string,
  ): Promise<SuccessResponseDto | ErrorResponseDto> {
    const slDto = new CreateSystemLogDto();
    slDto.profile_id = logged_in_user_id;
    slDto.platform = platform;
    slDto.action = 'fetch all service centres';
    const { data, error } = await this.postgresrest
      .from('service_centres')
      .select()
      .eq('id', id)
      .single();
    if (error) {
      slDto.response = error;
      await this.slService.createSystemLogs(slDto);
      this.logger.error(`Error fetching service centres: ${error.message}`);
      return new ErrorResponseDto(
        400,
        'Failed to fetch service centres',
        error,
      );
    }
    slDto.response = {
      statusCode: 200,
      message: 'Service centres fetched successfully',
    };
    await this.slService.createSystemLogs(slDto);
    return new SuccessResponseDto(
      200,
      'Service centre fetched successfully',
      data as object,
    );
  }
}
