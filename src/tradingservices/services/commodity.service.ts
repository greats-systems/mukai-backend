/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
// commodity.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { PostgresRest } from 'src/common/postgresrest/postgresrest';
import { CreateCommodityDto } from '../dto/create/create-commodity.dto';
import { Commodity } from '../entities/commodity.entity';

@Injectable()
export class CommodityService {
  private readonly logger = new Logger(CommodityService.name);

  constructor(private readonly postgresrest: PostgresRest) {}

  async createCommodity(
    createCommodityDto: CreateCommodityDto,
  ): Promise<Commodity> {
    try {
      const { data, error } = await this.postgresrest
        .from('Commodity')
        .insert({
          ...createCommodityDto,
          created_at: new Date().toISOString(),
        })
        .select('*')
        .single();

      if (error) {
        this.logger.error(`Failed to create commodity: ${error.message}`);
        throw new Error(error.message);
      }

      return data as Commodity;
    } catch (error) {
      this.logger.error(`Error creating commodity: ${error.message}`);
      throw error;
    }
  }

  async findAllCommodities(): Promise<Commodity[]> {
    try {
      const { data, error } = await this.postgresrest
        .from('Commodity')
        .select('*');

      if (error) {
        this.logger.error(`Failed to fetch commodities: ${error.message}`);
        throw new Error(error.message);
      }

      return data as Commodity[];
    } catch (error) {
      this.logger.error(`Error fetching commodities: ${error.message}`);
      throw error;
    }
  }

  async findCommodityById(commodity_id: string): Promise<Commodity> {
    try {
      const { data, error } = await this.postgresrest
        .from('Commodity')
        .select('*')
        .eq('commodity_id', commodity_id)
        .single();

      if (error || !data) {
        this.logger.error(`Commodity ${commodity_id} not found`);
        throw new Error(error?.message || 'Commodity not found');
      }

      return data as Commodity;
    } catch (error) {
      this.logger.error(
        `Error fetching commodity ${commodity_id}: ${error.message}`,
      );
      throw error;
    }
  }
}
