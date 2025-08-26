import { Body, Controller, HttpException, Post } from '@nestjs/common';
import { SmilePayService } from '../services/smilepay.service';
import { GeneralErrorResponseDto } from 'src/common/dto/general-error-response.dto';
import {
  ExpressPaymentSmilePayRequestAuth,
  ExpressPaymentSmilePayRequestConfirm,
} from '../requests/smilepay.requests';

@Controller('smilepay')
export class SmilePayController {
  constructor(private readonly spService: SmilePayService) {}

  @Post('auth')
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
}
