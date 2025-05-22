// src/business/business.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';

import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  BusinessResponseDto,
  CreateBusinessDto,
} from './dto/create-organization.dto';
import { OrganizationsService } from './organizations.service';
import { UpdateBusinessDto } from './dto/update-organization.dto';

@ApiTags('businesses')
@Controller('businesses')
export class OrganizationsController {
  constructor(private readonly businessService: OrganizationsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new business' })
  @ApiResponse({
    status: 201,
    description: 'The business has been successfully created.',
    type: BusinessResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  create(@Body() createBusinessDto: CreateBusinessDto) {
    return this.businessService.create(createBusinessDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all businesses' })
  @ApiResponse({
    status: 200,
    description: 'List of all businesses',
    type: [BusinessResponseDto],
  })
  findAll() {
    return this.businessService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific business by ID' })
  @ApiResponse({
    status: 200,
    description: 'The found business',
    type: BusinessResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Business not found.' })
  findOne(@Param('id') id: string) {
    return this.businessService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a business' })
  @ApiResponse({
    status: 200,
    description: 'The business has been successfully updated.',
    type: BusinessResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Business not found.' })
  update(
    @Param('id') id: string,
    @Body() updateBusinessDto: UpdateBusinessDto,
  ) {
    return this.businessService.update(id, updateBusinessDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a business' })
  @ApiResponse({
    status: 204,
    description: 'The business has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'Business not found.' })
  remove(@Param('id') id: string) {
    return this.businessService.remove(id);
  }
}
