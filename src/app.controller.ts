/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { JwtAuthGuard } from './auth/guards/jwt.auth.guard';
import { ApiExcludeController } from '@nestjs/swagger';

// @ApiExcludeEndpoint()
@ApiExcludeController()
@Controller('')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('/users')
  @UseGuards(JwtAuthGuard)
  protected(@Req() req) {
    return {
      message: 'AuthGuard works 🎉',
      authenticated_user: req.user,
    };
  }

  @Get('/objects')
  getObjects(): object {
    return this.appService.getObject();
  }
}
