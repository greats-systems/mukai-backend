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

function initLogger(funcname: Function): Logger {
  return new Logger(funcname.name);
}

@Injectable()
export class AssetsService {
  private readonly logger = initLogger(AssetsService);
  constructor(private readonly postgresrest: PostgresRest) {}

  async createAsset(
    createAssetDto: CreateAssetDto,
  ): Promise<Asset | ErrorResponseDto> {
    try {
      /*
      const Asset = new Asset();

      Asset.id ?: string;
      Asset.handling_smart_contract ?: string;
      Asset.is_collateral_required ?: boolean;
      Asset.requesting_account ?: string;
      Asset.offering_account ?: string;
      Asset.collateral_asset_id ?: string;
      Asset.payment_due ?: string;
      Asset.payment_terms ?: string;
      Asset.amount ?: string;
      Asset.payments_handling_wallet_id ?: string;
      Asset.collateral_asset_handler_id ?: string;
      Asset.collateral_asset_handler_fee ?: string;

      Asset.provider_id = createAssetDto.provider_id;
      Asset.Asset_name = createAssetDto.Asset_name;
      Asset.unit_measure = createAssetDto.unit_measure;
      Asset.unit_price = createAssetDto.unit_price;
      Asset.max_capacity = createAssetDto.max_capacity;

      // Check if the given Asset already exists
      if (await this.checkIfProductExists(Asset.provider_id)) {
        return new ErrorResponseDto(
          409,
          'You have already registered this Asset',
        );
      }
        */

      const { data, error } = await this.postgresrest
        .from('assets')
        .insert(createAssetDto)
        .single();
      if (error) {
        console.log(error);
        return new ErrorResponseDto(400, error.message);
      }
      return data as Asset;
    } catch (error) {
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
  ): Promise<Asset | ErrorResponseDto> {
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
      return data as Asset;
    } catch (error) {
      this.logger.error(`Exception in updateAsset for id ${id}`, error);
      return new ErrorResponseDto(500, error);
    }
  }

  async deleteAsset(id: string): Promise<boolean | ErrorResponseDto> {
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

      return true;
    } catch (error) {
      this.logger.error(`Exception in deleteAsset for id ${id}`, error);
      return new ErrorResponseDto(500, error);
    }
  }
}
