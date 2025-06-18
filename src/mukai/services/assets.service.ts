/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-function-type */
// import { Logger, Injectable } from "@nestjs/common";
import { ErrorResponseDto } from 'src/common/dto/error-response.dto';
import { PostgresRest } from 'src/common/postgresrest';
// import { Logger } from 'typeorm';
import { UpdateAssetDto } from '../dto/update/update-asset.dto';
import { Asset } from '../entities/asset.entity';
import { CreateAssetDto } from '../dto/create/create-asset.dto';
import { Injectable, Logger } from '@nestjs/common';
import { SuccessResponseDto } from 'src/common/dto/success-response.dto';

function initLogger(funcname: Function): Logger {
  return new Logger(funcname.name);
}

@Injectable()
export class AssetsService {
  private readonly logger = initLogger(AssetsService);
  constructor(private readonly postgresrest: PostgresRest) {}

  async createAsset(
    createAssetDto: CreateAssetDto,
  ): Promise<SuccessResponseDto | ErrorResponseDto> {
    try {
      const { data, error } = await this.postgresrest
        .from('assets')
        .insert(createAssetDto)
        .single();
      if (error) {
        console.log(error);
        return new ErrorResponseDto(400, error.message);
      }
      return {
        statusCode: 201,
        message: 'Asset created successfully',
        data: data as Asset,
      };
    } catch (error) {
      return new ErrorResponseDto(500, error);
    }
  }
// get group assets
  async getGroupAssets(group_id: string): Promise<SuccessResponseDto | ErrorResponseDto> {
    try {
      const { data, error } = await this.postgresrest.from('assets').select().eq('group_id', group_id);
      if (error) {
        this.logger.error('Error fetching Group Assets', error);
        return new ErrorResponseDto(400, error.message);
      }
      return {
        statusCode: 200,
        message: 'Group assets fetched successfully',
        data: data as Asset[],
      };
    } catch (error) {
      this.logger.error('Exception in getGroupAssets', error);
      return new ErrorResponseDto(500, error);
    }
  }

  async getProfileAssets(profile_id: string): Promise<SuccessResponseDto | ErrorResponseDto> {
    try {
      const { data, error } = await this.postgresrest.from('assets').select().eq('profile_id', profile_id);
      if (error) {
        this.logger.error('Error fetching Group Assets', error);
        return new ErrorResponseDto(400, error.message);
      }
      return {
        statusCode: 200,
        message: 'Group assets fetched successfully',
        data: data as Asset[],
      };
    } catch (error) {
      this.logger.error('Exception in getGroupAssets', error);
      return new ErrorResponseDto(500, error);
    }
  }
  async findAllAssets(): Promise<Asset[] | ErrorResponseDto> {
    try {
      const { data, error } = await this.postgresrest.from('assets').select();

      if (error) {
        this.logger.error('Error fetching Assets', error);
        return new ErrorResponseDto(400, error.message);
      }

      return data as Asset[];
    } catch (error) {
      this.logger.error('Exception in findAllAssets', error);
      return new ErrorResponseDto(500, error);
    }
  }

  async viewAsset(id: string): Promise<Asset | ErrorResponseDto> {
    try {
      const { data, error } = await this.postgresrest
        .from('assets')
        .select()
        .eq('id', id)
        .single();

      if (error) {
        this.logger.error(`Error fetching Asset ${id}`, error);
        return new ErrorResponseDto(400, error.message);
      }

      return data as Asset;
    } catch (error) {
      this.logger.error(`Exception in viewAsset for id ${id}`, error);
      return new ErrorResponseDto(500, error);
    }
  }

  async updateAsset(
    id: string,
    updateAssetDto: UpdateAssetDto,
  ): Promise<SuccessResponseDto | ErrorResponseDto> {
    try {
      const { data, error } = await this.postgresrest
        .from('assets')
        .update(updateAssetDto)
        .eq('id', id)
        .select()
        .single();
      if (error) {
        this.logger.error(`Error updating Assets ${id}`, error);
        return new ErrorResponseDto(400, error.message);
      }
      return {
        statusCode: 200,
        message: 'Asset updated successfully',
        data: data as Asset,
      };
    } catch (error) {
      this.logger.error(`Exception in updateAsset for id ${id}`, error);
      return new ErrorResponseDto(500, error);
    }
  }

  async deleteAsset(id: string): Promise<SuccessResponseDto | ErrorResponseDto> {
    try {
      const { error } = await this.postgresrest
        .from('assets')
        .delete()
        .eq('id', id)
        .single();

      if (error) {
        this.logger.error(`Error deleting Asset ${id}`, error);
        return new ErrorResponseDto(400, error.message);
      }
      return {
        statusCode: 200,
        message: 'Asset deleted successfully',
      };
    } catch (error) {
      this.logger.error(`Exception in deleteAsset for id ${id}`, error);
      return new ErrorResponseDto(500, error);
    }
  }
}
