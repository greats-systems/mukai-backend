/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-function-type */
import { Logger, Injectable } from '@nestjs/common';
import { ErrorResponseDto } from 'src/common/dto/error-response.dto';
import { PostgresRest } from 'src/common/postgresrest';
import { CreateOrganizationDto } from 'src/organizations/dto/create-organization.dto';
import { UpdateOrganizationDto } from 'src/organizations/dto/update-organization.dto';
import { Organization } from '../entities/organization.entity';

function initLogger(funcname: Function): Logger {
  return new Logger(funcname.name);
}

@Injectable()
export class OrganizationsService {
  private readonly logger = initLogger(OrganizationsService);
  constructor(private readonly postgresrest: PostgresRest) {}

  async createOrganization(
    createOrganizationDto: CreateOrganizationDto,
  ): Promise<Organization | ErrorResponseDto> {
    try {
      /*
      const organization = new Organization();
      
      Organization.id ?: string;
      Organization.handling_smart_contract ?: string;
      Organization.is_collateral_required ?: boolean;
      Organization.requesting_account ?: string;
      Organization.offering_account ?: string;
      Organization.collateral_Organization_id ?: string;
      Organization.payment_due ?: string;
      Organization.payment_terms ?: string;
      Organization.amount ?: string;
      Organization.payments_handling_wallet_id ?: string;
      Organization.collateral_Organization_handler_id ?: string;
      Organization.collateral_Organization_handler_fee ?: string;

      Organization.provider_id = createOrganizationDto.provider_id;
      Organization.Organization_name = createOrganizationDto.Organization_name;
      Organization.unit_measure = createOrganizationDto.unit_measure;
      Organization.unit_price = createOrganizationDto.unit_price;
      Organization.max_capacity = createOrganizationDto.max_capacity;

      // Check if the given Organization already exists
      if (await this.checkIfProductExists(Organization.provider_id)) {
        return new ErrorResponseDto(
          409,
          'You have already registered this Organization',
        );
      }
        */

      const { data, error } = await this.postgresrest
        .from('organizations')
        .insert(createOrganizationDto)
        .single();
      if (error) {
        console.log(error);
        return new ErrorResponseDto(400, error.message);
      }
      return data as Organization;
    } catch (error) {
      return new ErrorResponseDto(500, error);
    }
  }

  async findAllOrganizations(): Promise<Organization[] | ErrorResponseDto> {
    try {
      const { data, error } = await this.postgresrest
        .from('organizations')
        .select();

      if (error) {
        this.logger.error('Error fetching Organizations', error);
        return new ErrorResponseDto(400, error.message);
      }

      return data as Organization[];
    } catch (error) {
      this.logger.error('Exception in findAllOrganizations', error);
      return new ErrorResponseDto(500, error);
    }
  }

  async viewOrganization(id: string): Promise<Organization | ErrorResponseDto> {
    try {
      const { data, error } = await this.postgresrest
        .from('organizations')
        .select()
        .eq('id', id)
        .single();

      if (error) {
        this.logger.error(`Error fetching Organization ${id}`, error);
        return new ErrorResponseDto(400, error.message);
      }

      return data as Organization;
    } catch (error) {
      this.logger.error(`Exception in viewOrganization for id ${id}`, error);
      return new ErrorResponseDto(500, error);
    }
  }

  async updateOrganization(
    id: string,
    updateOrganizationDto: UpdateOrganizationDto,
  ): Promise<Organization | ErrorResponseDto> {
    try {
      const { data, error } = await this.postgresrest
        .from('organizations')
        .update(updateOrganizationDto)
        .eq('id', id)
        .select()
        .single();
      if (error) {
        this.logger.error(`Error updating Organizations ${id}`, error);
        return new ErrorResponseDto(400, error.message);
      }
      return data as Organization;
    } catch (error) {
      this.logger.error(`Exception in updateOrganization for id ${id}`, error);
      return new ErrorResponseDto(500, error);
    }
  }

  async deleteOrganization(id: string): Promise<boolean | ErrorResponseDto> {
    try {
      const { error } = await this.postgresrest
        .from('organizations')
        .delete()
        .eq('id', id)
        .single();

      if (error) {
        this.logger.error(`Error deleting Organization ${id}`, error);
        return new ErrorResponseDto(400, error.message);
      }

      return true;
    } catch (error) {
      this.logger.error(`Exception in deleteOrganization for id ${id}`, error);
      return new ErrorResponseDto(500, error);
    }
  }
}
