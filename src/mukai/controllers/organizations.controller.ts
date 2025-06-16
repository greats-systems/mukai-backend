import { Controller, Get, Post, Body, Param, Patch, Delete, HttpException, HttpStatus } from '@nestjs/common';
import { OrganizationsService } from '../services/organizations.service';
import { CreateOrganizationDto } from '../dto/create/create-organization.dto';
import { UpdateOrganizationDto } from '../dto/update/update-organization.dto';

@Controller('organizations')
export class OrganizationsController {
  constructor(private readonly organizationsService: OrganizationsService) {}

  @Post()
  async create(@Body() createOrganizationDto: CreateOrganizationDto) {
    const response = await this.organizationsService.createOrganization(createOrganizationDto);
    if (response['statusCode'] === 400) {
      throw new HttpException(response['message'], HttpStatus.BAD_REQUEST);
    }
    if (response['statusCode'] === 500) {
      throw new HttpException(response['message'], HttpStatus.INTERNAL_SERVER_ERROR);
    }
    return response;
  }

  @Get()
  async findAll() {
    const response = await this.organizationsService.findAllOrganizations();
    if (response['statusCode'] === 400) {
      throw new HttpException(response['message'], HttpStatus.BAD_REQUEST);
    }
    if (response['statusCode'] === 500) {
      throw new HttpException(response['message'], HttpStatus.INTERNAL_SERVER_ERROR);
    }
    return response;
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const response = await this.organizationsService.viewOrganization(id);
    if (response['statusCode'] === 400) {
      throw new HttpException(response['message'], HttpStatus.BAD_REQUEST);
    }
    if (response['statusCode'] === 500) {
      throw new HttpException(response['message'], HttpStatus.INTERNAL_SERVER_ERROR);
    }
    return response;
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateOrganizationDto: UpdateOrganizationDto) {
    const response = await this.organizationsService.updateOrganization(id, updateOrganizationDto);
    if (response['statusCode'] === 400) {
      throw new HttpException(response['message'], HttpStatus.BAD_REQUEST);
    }
    if (response['statusCode'] === 500) {
      throw new HttpException(response['message'], HttpStatus.INTERNAL_SERVER_ERROR);
    }
    return response;
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    const response = await this.organizationsService.deleteOrganization(id);
    if (response['statusCode'] === 400) {
      throw new HttpException(response['message'], HttpStatus.BAD_REQUEST);
    }
    if (response['statusCode'] === 500) {
      throw new HttpException(response['message'], HttpStatus.INTERNAL_SERVER_ERROR);
    }
    return response;
  }
}
