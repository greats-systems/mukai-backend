import { Body, Controller, HttpException, Post } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { SmilePayService } from '../services/smilepay.service';
import { GeneralErrorResponseDto } from 'src/common/dto/general-error-response.dto';
import {
  EcocashPaymentRequest,
  ExpressPaymentAuth,
  ExpressPaymentConfirm,
  ExpressPaymentSmilePayRequestAuth,
  ExpressPaymentSmilePayRequestConfirm,
  StandardCheckoutRequest,
} from '../requests/smilepay.requests';

@ApiTags('SmilePay - Express Checkout')
@Controller('smilepay')
// @ApiExcludeController() // Uncomment if you want to exclude from Swagger
export class SmilePayController {
  constructor(private readonly spService: SmilePayService) {}

  @Post('auth')
  @ApiOperation({
    summary: 'Initiate SmilePay express checkout authentication',
    description:
      'Authenticates and initiates a SmilePay express checkout transaction',
  })
  @ApiBody({ type: ExpressPaymentSmilePayRequestAuth })
  @ApiResponse({
    status: 200,
    description: 'Authentication initiated successfully',
    type: Object, // Replace with actual success response DTO
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid request parameters',
    type: GeneralErrorResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Authentication failed',
    type: GeneralErrorResponseDto,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
    type: GeneralErrorResponseDto,
  })
  async initiateExpressCheckoutSmilePay(
    @Body() authRequest: ExpressPaymentSmilePayRequestAuth,
  ) {
    const response =
      await this.spService.initiateExpressCheckoutSmilePay(authRequest);
    if (response instanceof GeneralErrorResponseDto) {
      throw new HttpException(response, response.statusCode);
    }
    return response;
  }

  @Post('confirm')
  @ApiOperation({
    summary: 'Confirm SmilePay express checkout with OTP',
    description: 'Confirms a SmilePay transaction using the provided OTP',
  })
  @ApiBody({ type: ExpressPaymentSmilePayRequestConfirm })
  @ApiResponse({
    status: 200,
    description: 'Payment confirmed successfully',
    type: ExpressPaymentConfirm,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid OTP or transaction reference',
    type: GeneralErrorResponseDto,
  })
  @ApiResponse({
    status: 410,
    description: 'OTP expired',
    type: GeneralErrorResponseDto,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
    type: GeneralErrorResponseDto,
  })
  async confirmExpressCheckoutSmilePay(
    @Body() confirmRequest: ExpressPaymentSmilePayRequestConfirm,
  ) {
    const response =
      await this.spService.confirmExpressCheckoutSmilePay(confirmRequest);
    if (response instanceof GeneralErrorResponseDto) {
      throw new HttpException(response, response.statusCode);
    }
    return response;
  }

  @Post('innbucks')
  @ApiOperation({
    summary: 'Initiate InnBucks express checkout',
    description: 'Initiates an express checkout transaction using InnBucks',
  })
  @ApiBody({ type: ExpressPaymentAuth })
  @ApiResponse({
    status: 200,
    description: 'InnBucks checkout initiated successfully',
    type: Object, // Replace with actual success response DTO
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid request parameters',
    type: GeneralErrorResponseDto,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
    type: GeneralErrorResponseDto,
  })
  async initiateExpressCheckoutInnbucks(
    @Body() innbucksRequest: ExpressPaymentAuth,
  ) {
    const response =
      await this.spService.initiateExpressCheckoutInnbucks(innbucksRequest);
    if (response instanceof GeneralErrorResponseDto) {
      throw new HttpException(response, response.statusCode);
    }
    return response;
  }

  @Post('ecocash')
  @ApiOperation({
    summary: 'Initiate EcoCash express checkout',
    description: 'Initiates an express checkout transaction using EcoCash',
  })
  @ApiBody({ type: EcocashPaymentRequest })
  @ApiResponse({
    status: 200,
    description: 'EcoCash checkout initiated successfully',
    type: EcocashPaymentRequest, // Replace with actual success response DTO
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid request parameters',
    type: GeneralErrorResponseDto,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
    type: GeneralErrorResponseDto,
  })
  async initiateExpressCheckoutEcocash(
    @Body() ecocashRequest: EcocashPaymentRequest,
  ) {
    const response =
      await this.spService.initiateExpressCheckoutEcocash(ecocashRequest);
    if (response instanceof GeneralErrorResponseDto) {
      throw new HttpException(response, response.statusCode);
    }
    return response;
  }

  @Post('omari')
  @ApiOperation({
    summary: 'Initiate Omari express checkout',
    description: 'Initiates an express checkout transaction using Omari',
  })
  @ApiBody({ type: ExpressPaymentAuth })
  @ApiResponse({
    status: 200,
    description: 'Omari checkout initiated successfully',
    type: Object, // Replace with actual success response DTO
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid request parameters',
    type: GeneralErrorResponseDto,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
    type: GeneralErrorResponseDto,
  })
  async initiateExpressCheckoutOmari(@Body() omariRequest: ExpressPaymentAuth) {
    const response =
      await this.spService.initiateExpressCheckoutOmari(omariRequest);
    if (response instanceof GeneralErrorResponseDto) {
      throw new HttpException(response, response.statusCode);
    }
    return response;
  }

  @Post('omari/confirmation')
  @ApiOperation({
    summary: 'Confirm Omari express checkout',
    description: 'Confirms an Omari express checkout transaction',
  })
  @ApiBody({ type: ExpressPaymentConfirm })
  @ApiResponse({
    status: 200,
    description: 'Omari payment confirmed successfully',
    type: Object, // Replace with actual success response DTO
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid confirmation parameters',
    type: GeneralErrorResponseDto,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
    type: GeneralErrorResponseDto,
  })
  async confirmExpressCheckoutOmari(
    @Body() omariConfirmRequest: ExpressPaymentConfirm,
  ) {
    const response =
      await this.spService.confirmExpressCheckoutOmari(omariConfirmRequest);
    if (response instanceof GeneralErrorResponseDto) {
      throw new HttpException(response, response.statusCode);
    }
    return response;
  }

  @Post('visa-mastercard')
  @ApiOperation({
    summary: 'Initiate Visa/Mastercard express checkout',
    description:
      'Initiates an express checkout transaction using Visa or Mastercard',
  })
  @ApiBody({ type: ExpressPaymentAuth })
  @ApiResponse({
    status: 200,
    description: 'Visa/Mastercard checkout initiated successfully',
    type: Object, // Replace with actual success response DTO
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid request parameters',
    type: GeneralErrorResponseDto,
  })
  @ApiResponse({
    status: 402,
    description: 'Payment declined',
    type: GeneralErrorResponseDto,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
    type: GeneralErrorResponseDto,
  })
  async initiateExpressCheckoutVisaMastercard(
    @Body() visamcRequest: ExpressPaymentAuth,
  ) {
    const response =
      await this.spService.initiateExpressCheckoutVisaMastercard(visamcRequest);
    if (response instanceof GeneralErrorResponseDto) {
      throw new HttpException(response, response.statusCode);
    }
    return response;
  }

  @Post('initiate-payment')
  @ApiOperation({
    summary: 'Initiate standard checkout',
    description:
      'Initiates a standard transaction using any supported payment option',
  })
  @ApiBody({ type: StandardCheckoutRequest })
  @ApiResponse({
    status: 200,
    description: 'Standard checkout initiated successfully',
    type: StandardCheckoutRequest, // Replace with actual success response DTO
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid request parameters',
    type: GeneralErrorResponseDto,
  })
  @ApiResponse({
    status: 402,
    description: 'Payment declined',
    type: GeneralErrorResponseDto,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
    type: GeneralErrorResponseDto,
  })
  async initiateStandardCheckout(@Body() scRequest: StandardCheckoutRequest) {
    const response = await this.spService.initiateStandardCheckout(scRequest);
    if (response instanceof GeneralErrorResponseDto) {
      throw new HttpException(response.message!, response.statusCode);
    }
    return response;
  }
}
