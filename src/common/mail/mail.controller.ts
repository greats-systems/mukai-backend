import { Controller, Get, Logger } from '@nestjs/common';
import { MailService } from './mail.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Mail') // Groups this controller's endpoints under "mail" in Swagger UI
@Controller('mail')
export class MailController {
  private readonly logger = new Logger(MailController.name);
  constructor(private readonly mailService: MailService) {}

  @Get()
  @ApiOperation({
    summary: 'Send an OTP email',
    description:
      'Sends an OTP verification email to a predefined email address with a signup confirmation template',
  })
  @ApiResponse({
    status: 200,
    description: 'OTP sent successfully',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error or email sending failed',
  })
  async sendOtpEmail() {
    const response = await this.mailService.sendOtpEmail(
      'anesugandiwa9@gmail.com',
      { name: 'Anesu', otp: '123456', validity: 5 },
    );
    this.logger.warn('Mail response', response);
    return response;
  }
}
