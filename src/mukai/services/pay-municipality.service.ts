/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-function-type */
import { Logger, Injectable } from '@nestjs/common';
import { ErrorResponseDto } from 'src/common/dto/error-response.dto';
import { PostgresRest } from 'src/common/postgresrest';

function initLogger(funcname: Function): Logger {
  return new Logger(funcname.name);
}

@Injectable()
export class MunicipalitiesService {
  private readonly logger = initLogger(MunicipalitiesService);
  constructor(private readonly postgresrest: PostgresRest) {}

  async createMunicipality(
    createMunicipalitiesDto: object,
  ): Promise<object | ErrorResponseDto> {
    try {
      const { data, error } = await this.postgresrest
        .from('municipalities')
        .insert(createMunicipalitiesDto)
        .select()
        .single();
      if (error) {
        this.logger.log(error);
        return new ErrorResponseDto(400, error.details);
      }
      return data as object;
    } catch (error) {
      return new ErrorResponseDto(500, error);
    }
  }

  async findAllMunicipalities(): Promise<object[] | ErrorResponseDto> {
    try {
      const { data, error } = await this.postgresrest
        .from('municipalities')
        .select()
        .order('created_at', { ascending: false });

      if (error) {
        this.logger.error('Error fetching municipalities', error);
        return new ErrorResponseDto(400, error.details);
      }

      return data as object[];
    } catch (error) {
      this.logger.error('Exception in findAllMunicipalities', error);
      return new ErrorResponseDto(500, error);
    }
  }

  async viewMunicipality(id: string): Promise<object[] | ErrorResponseDto> {
    try {
      const { data, error } = await this.postgresrest
        .from('municipalities')
        .select()
        .eq('id', id)
        .maybeSingle();

      if (error) {
        this.logger.error(`Error fetching group ${id}`, error);
        return new ErrorResponseDto(400, error.details);
      }

      return data as object[];
    } catch (error) {
      this.logger.error(`Exception in viewMunicipalities for id ${id}`, error);
      return new ErrorResponseDto(500, error);
    }
  }

  async viewMunicipalityByName(
    name: string,
  ): Promise<object | ErrorResponseDto> {
    try {
      const { data, error } = await this.postgresrest
        .from('municipalities')
        .select()
        .eq('name', name)
        .maybeSingle();

      if (error) {
        this.logger.error(`Error fetching group ${name}`, error);
        return new ErrorResponseDto(400, error.details);
      }

      return data as object;
    } catch (error) {
      this.logger.error(
        `Exception in viewMunicipalities for name ${name}`,
        error,
      );
      return new ErrorResponseDto(500, error);
    }
  }

  async updateMunicipality(
    id: string,
    updateMunicipalitiesDto: object,
  ): Promise<object | ErrorResponseDto> {
    try {
      const { data, error } = await this.postgresrest
        .from('municipalities')
        .update(updateMunicipalitiesDto)
        .eq('id', id)
        .select()
        .maybeSingle();
      if (error) {
        this.logger.error(`Error updating municipalities ${id}`, error);
        return new ErrorResponseDto(400, error.details);
      }
      return data as object;
    } catch (error) {
      this.logger.error(
        `Exception in updateMunicipalities for id ${id}`,
        error,
      );
      return new ErrorResponseDto(500, error);
    }
  }

  async deleteMunicipality(id: string): Promise<boolean | ErrorResponseDto> {
    try {
      const { error } = await this.postgresrest
        .from('municipalities')
        .delete()
        .eq('id', id)
        .maybeSingle();

      if (error) {
        this.logger.error(`Error deleting group ${id}`, error);
        return new ErrorResponseDto(400, error.details);
      }

      return true;
    } catch (error) {
      this.logger.error(
        `Exception in deleteMunicipalities for id ${id}`,
        error,
      );
      return new ErrorResponseDto(500, error);
    }
  }
}
