import {
  Controller,
  Post,
  Body,
  Put,
  Param,
  HttpCode,
  Get,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AccessAccountDto, LoginDto } from './dto/login.dto';
import { SignupDto } from './dto/signup.dto';
import { Profile } from 'src/user/entities/user.entity';
import { MukaiProfile } from 'src/user/entities/mukai-user.entity';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('profiles')
  async getProfiles() {
    return this.authService.getProfiles();
  }

  @Post('create-account')
  async signup(@Body() signupDto: SignupDto) {
    return this.authService.signup(signupDto);
  }
  @Put('update-account/:id')
  async update(@Body() profile: MukaiProfile) {
    return this.authService.update(profile);
  }
  @Put('update-fcm/:id')
  async updateFCM(@Body() profile: Profile) {
    return this.authService.updateFCM(profile);
  }
  @Post('login')
  @HttpCode(200)
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }
  @Post('logout/:id')
  async logout(@Param('id') id: string) {
    return this.authService.logout(id);
  }
  @Post('validate-profile')
  async validate_profile(@Body() accessToken: AccessAccountDto) {
    return this.authService.validate_profile(accessToken);
  }
}
