import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
  Get,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { AgreementsService } from '../services/agreements.service';
import { CreateAgreementDto } from '../dto/create/create-agreement.dto';
import { UpdateAgreementDto } from '../dto/update/update-agreement.dto';

@Controller('agreements')
export class AgreementsController {
  constructor(private readonly agreementsService: AgreementsService) {}

  @Post()
  async create(
    @Body()
    createAgreementsDto: CreateAgreementDto,
  ) {
    const response =
      await this.agreementsService.createAgreement(createAgreementsDto);
    if (response['statusCode'] == 400) {
      throw new HttpException(response['message'], HttpStatus.BAD_REQUEST);
    }
    if (response['statusCode'] == 409) {
      throw new HttpException(response['message'], HttpStatus.CONFLICT);
    }
    if (response['statusCode'] == 500) {
      throw new HttpException(
        response['message'],
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    return response;
  }

  @Get()
  async findAll() {
    const response = await this.agreementsService.findAllAgreements();
    if (response['statusCode'] == 400) {
      throw new HttpException(response['message'], HttpStatus.BAD_REQUEST);
    }
    if (response['statusCode'] == 500) {
      throw new HttpException(
        response['message'],
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    return response;
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const response = await this.agreementsService.viewAgreement(id);
    if (response['statusCode'] == 400) {
      throw new HttpException(response['message'], HttpStatus.BAD_REQUEST);
    }
    if (response['statusCode'] == 500) {
      throw new HttpException(
        response['message'],
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    return response;
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body()
    updateAgreementsDto: UpdateAgreementDto,
  ) {
    const response = await this.agreementsService.updateAgreement(
      id,
      updateAgreementsDto,
    );
    if (response['statusCode'] == 400) {
      throw new HttpException(response['message'], HttpStatus.BAD_REQUEST);
    }
    if (response['statusCode'] == 500) {
      throw new HttpException(
        response['message'],
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    return response;
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    const response = this.agreementsService.deleteAgreement(id);
    if (response['statusCode'] == 400) {
      throw new HttpException(response['message'], HttpStatus.BAD_REQUEST);
    }
    if (response['statusCode'] == 500) {
      throw new HttpException(
        response['message'],
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    return response;
  }
}
