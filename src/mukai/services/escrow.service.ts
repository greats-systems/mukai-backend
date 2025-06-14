/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-function-type */
import { Logger, Injectable } from '@nestjs/common';
import { ErrorResponseDto } from 'src/common/dto/error-response.dto';
import { PostgresRest } from 'src/common/postgresrest';
import { CreateEscrowDto } from '../dto/create/create-escrow.dto';
import { UpdateEscrowDto } from '../dto/update/update-escrow.dto';
import { Escrow } from '../entities/escrow.entity';

function initLogger(funcname: Function): Logger {
  return new Logger(funcname.name);
}

@Injectable()
export class EscrowService {
  private readonly logger = initLogger(EscrowService);
  constructor(private readonly postgresrest: PostgresRest) {}

  async createEscrow(
    createEscrowDto: CreateEscrowDto,
  ): Promise<Escrow | ErrorResponseDto> {
    try {
      const { data, error } = await this.postgresrest
        .from('escrow')
        .insert(createEscrowDto)
        .single();
      if (error) {
        console.log(error);
        return new ErrorResponseDto(400, error.message);
      }
      return data as Escrow;
    } catch (error) {
      return new ErrorResponseDto(500, error);
    }
  }

  async findAllEscrows(): Promise<Escrow[] | ErrorResponseDto> {
    try {
      const { data, error } = await this.postgresrest
        .from('escrow')
        .select()
        .order('created_at', { ascending: false });

      if (error) {
        this.logger.error('Error fetching escrow', error);
        return new ErrorResponseDto(400, error.message);
      }

      return data as Escrow[];
    } catch (error) {
      this.logger.error('Exception in findAllEscrow', error);
      return new ErrorResponseDto(500, error);
    }
  }

  async viewEscrow(wallet_id: string): Promise<Escrow[] | ErrorResponseDto> {
    try {
      const { data, error } = await this.postgresrest
        .from('escrow')
        .select()
        .eq('wallet_id', wallet_id)
        .single();

      if (error) {
        this.logger.error(`Error fetching group ${wallet_id}`, error);
        return new ErrorResponseDto(400, error.message);
      }

      return data as Escrow[];
    } catch (error) {
      this.logger.error(`Exception in viewEscrow for id ${wallet_id}`, error);
      return new ErrorResponseDto(500, error);
    }
  }

  async updateEscrow(
    wallet_id: string,
    updateEscrowDto: UpdateEscrowDto,
  ): Promise<Escrow | ErrorResponseDto> {
    try {
      const { data, error } = await this.postgresrest
        .from('escrow')
        .update(updateEscrowDto)
        .eq('wallet_id', wallet_id)
        .select()
        .single();
      if (error) {
        this.logger.error(`Error updating escrow ${wallet_id}`, error);
        return new ErrorResponseDto(400, error.message);
      }
      return data as Escrow;
    } catch (error) {
      this.logger.error(`Exception in updateEscrow for id ${wallet_id}`, error);
      return new ErrorResponseDto(500, error);
    }
  }

  async deleteEscrow(id: string): Promise<boolean | ErrorResponseDto> {
    try {
      const { error } = await this.postgresrest
        .from('escrow')
        .delete()
        .eq('id', id)
        .single();

      if (error) {
        this.logger.error(`Error deleting group ${id}`, error);
        return new ErrorResponseDto(400, error.message);
      }

      return true;
    } catch (error) {
      this.logger.error(`Exception in deleteEscrow for id ${id}`, error);
      return new ErrorResponseDto(500, error);
    }
  }
}
