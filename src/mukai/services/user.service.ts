/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-function-type */
import { Logger, Injectable } from '@nestjs/common';
import { SignupDto } from 'src/auth/dto/signup.dto';
import { ErrorResponseDto } from 'src/common/dto/error-response.dto';
import { PostgresRest } from 'src/common/postgresrest';

function initLogger(funcname: Function): Logger {
  return new Logger(funcname.name);
}

@Injectable()
export class UserService {
  private readonly logger = initLogger(UserService);
  constructor(private readonly postgresrest: PostgresRest) {}

  async createUser(
    createUserDto: SignupDto,
  ): Promise<object | ErrorResponseDto> {
    try {
      const { data, error } = await this.postgresrest
        .from('profiles')
        .insert(createUserDto)
        .single();
      if (error) {
        console.log(error);
        return new ErrorResponseDto(400, error.details);
      }
      return data as object;
    } catch (error) {
      return new ErrorResponseDto(500, error);
    }
  }

  async findAllUsers(): Promise<object[] | ErrorResponseDto> {
    try {
      const { data, error } = await this.postgresrest
        .from('profiles')
        .select()
        .order('created_at', { ascending: false });

      if (error) {
        this.logger.error('Error fetching profiles', error);
        return new ErrorResponseDto(400, error.details);
      }

      return data as object[];
    } catch (error) {
      this.logger.error('Exception in findAllUser', error);
      return new ErrorResponseDto(500, error);
    }
  }

  async viewUser(profile_id: string): Promise<object[] | ErrorResponseDto> {
    try {
      const { data, error } = await this.postgresrest
        .from('profiles')
        .select()
        .eq('id', profile_id)
        .single();

      if (error) {
        this.logger.error(`Error fetching group ${profile_id}`, error);
        return new ErrorResponseDto(400, error.details);
      }

      return data as object[];
    } catch (error) {
      this.logger.error(`Exception in viewUser for id ${profile_id}`, error);
      return new ErrorResponseDto(500, error);
    }
  }

  async updateUser(
    profile_id: string,
    updateUserDto: SignupDto,
  ): Promise<object | ErrorResponseDto> {
    try {
      const { data, error } = await this.postgresrest
        .from('profiles')
        .update(updateUserDto)
        .eq('id', profile_id)
        .select()
        .single();
      if (error) {
        this.logger.error(`Error updating profiles ${profile_id}`, error);
        return new ErrorResponseDto(400, error.details);
      }
      return data as object;
    } catch (error) {
      this.logger.error(`Exception in updateUser for id ${profile_id}`, error);
      return new ErrorResponseDto(500, error);
    }
  }

  async deleteUser(id: string): Promise<boolean | ErrorResponseDto> {
    try {
      const { error } = await this.postgresrest
        .from('profiles')
        .delete()
        .eq('id', id)
        .single();

      if (error) {
        this.logger.error(`Error deleting group ${id}`, error);
        return new ErrorResponseDto(400, error.details);
      }

      return true;
    } catch (error) {
      this.logger.error(`Exception in deleteUser for id ${id}`, error);
      return new ErrorResponseDto(500, error);
    }
  }
}
