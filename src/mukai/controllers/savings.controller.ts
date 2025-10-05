import { SavingsService } from '../services/savings.service';
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  HttpException,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { UpdateWalletDto } from '../dto/update/update-wallet.dto';
import {
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiBody,
  ApiParam,
  ApiBearerAuth,
  ApiExcludeController,
} from '@nestjs/swagger';
import { CreateSavingsDto } from '../dto/create/create-wallet-savings.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt.auth.guard';

@ApiTags('Savings Portfolio')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@ApiExcludeController()
@Controller('savings-portfolio')
export class SavingsController {
  constructor(private readonly savingsService: SavingsService) {}

  @Post()
  @ApiOperation({ summary: 'Create portfolio' })
  @ApiBody({ type: CreateSavingsDto })
  @ApiResponse({ status: 201, description: 'Portfolio created successfully.' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  async create(@Body() createSavingsDto: CreateSavingsDto) {
    const response =
      await this.savingsService.createSavingsPortfolio(createSavingsDto);
    if (response['statusCode'] === 400) {
      throw new HttpException(
        response['message'] ?? 'Bad request',
        HttpStatus.BAD_REQUEST,
      );
    }
    if (response['statusCode'] === 500) {
      throw new HttpException(
        response['message'] ?? 'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    return response;
  }
  @Get('coop-portfolio/:coop_id')
  @ApiOperation({ summary: 'Fetch a coop wallet' })
  @ApiParam({
    name: 'coop_id',
    description: 'Coop ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Coop wallet profile retrieved successfully.',
  })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  async viewCoopSavingsProfiles(@Param('coop_id') coop_id: string) {
    const response = await this.savingsService.viewCoopSavingsProfiles(coop_id);

    if (response['statusCode'] === 400) {
      throw new HttpException(
        response['message'] ?? 'Bad request',
        HttpStatus.BAD_REQUEST,
      );
    }
    if (response['statusCode'] === 500) {
      throw new HttpException(
        response['message'] ?? 'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    return response;
  }

  @Get('wallet-portfolio/:profile_id')
  @ApiOperation({ summary: 'Fetch a profile savings portfolio by profile ID' })
  @ApiParam({
    name: 'profile_id',
    description: 'Profile ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({ status: 200, description: 'Retrieved successfully.' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  async viewProfileSavings(@Param('wallet_id') wallet_id: string) {
    const response =
      await this.savingsService.viewWalletProfileSavings(wallet_id);

    if (response['statusCode'] === 400) {
      throw new HttpException(
        response['message'] ?? 'Bad request',
        HttpStatus.BAD_REQUEST,
      );
    }
    if (response['statusCode'] === 500) {
      throw new HttpException(
        response['message'] ?? 'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    return response;
  }
  @Get('profile-portfolio/:profile_id')
  @ApiOperation({ summary: 'Fetch a member wallet' })
  @ApiParam({
    name: 'profile_id',
    description: 'Profile ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Individual wallet retrieved successfully.',
  })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  async viewIndividualWallets(@Param('profile_id') profile_id: string) {
    const response =
      await this.savingsService.viewIndividualSavingsProfiles(profile_id);

    if (response['statusCode'] === 400) {
      throw new HttpException(
        response['message'] ?? 'Bad request',
        HttpStatus.BAD_REQUEST,
      );
    }
    if (response['statusCode'] === 500) {
      throw new HttpException(
        response['message'] ?? 'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    return response;
  }

  @Get(':id')
  @ApiOperation({ summary: 'Fetch Portfolio by ID' })
  @ApiParam({
    name: 'id',
    description: 'Portfolio ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Savings Portfolio retrieved successfully.',
  })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  async viewSavingsPortfolio(@Param('id') id: string) {
    const response = await this.savingsService.viewSavingsPortfolio(id);
    if (response['statusCode'] === 400) {
      throw new HttpException(
        response['message'] ?? 'Bad request',
        HttpStatus.BAD_REQUEST,
      );
    }
    if (response['statusCode'] === 500) {
      throw new HttpException(
        response['message'] ?? 'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    return response;
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a wallet by ID' })
  @ApiParam({
    name: 'id',
    description: 'Wallet ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiBody({ type: UpdateWalletDto })
  @ApiResponse({ status: 200, description: 'Wallet updated successfully.' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  async update(
    @Param('id') id: string,
    @Body() updateWalletDto: UpdateWalletDto,
  ) {
    const response = await this.savingsService.updateWallet(
      id,
      updateWalletDto,
    );
    if (response['statusCode'] === 400) {
      throw new HttpException(
        response['message'] ?? 'Bad request',
        HttpStatus.BAD_REQUEST,
      );
    }
    if (response['statusCode'] === 500) {
      throw new HttpException(
        response['message'] ?? 'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    return response;
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a wallet by ID' })
  @ApiParam({
    name: 'id',
    description: 'Wallet ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({ status: 200, description: 'Wallet deleted successfully.' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  async delete(@Param('id') id: string) {
    const response = await this.savingsService.deleteWallet(id);
    if (response['statusCode'] === 400) {
      throw new HttpException(
        response['message'] ?? 'Bad request',
        HttpStatus.BAD_REQUEST,
      );
    }
    if (response['statusCode'] === 500) {
      throw new HttpException(
        response['message'] ?? 'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    return response;
  }
}
