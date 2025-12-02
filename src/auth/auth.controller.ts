/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
  ApiExcludeEndpoint,
  ApiBearerAuth,
} from '@nestjs/swagger';
import {
  Controller,
  Post,
  Body,
  Put,
  Param,
  Get,
  HttpException,
  HttpStatus,
  Patch,
  Headers,
  Logger,
  UseGuards,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  AccessAccountDto,
  BannedProfileDto,
  LoginDto,
  OtpDto,
  ProfilesLikeDto,
  ProfileSuggestionsDto,
  ReinstateProfileDto,
  SecurityQuestionsDto,
} from './dto/login.dto';
import { SignupDto } from './dto/signup.dto';
import { Profile } from 'src/user/entities/user.entity';
import { MukaiProfile } from 'src/user/entities/mukai-user.entity';
import { AuthErrorResponse } from 'src/common/dto/auth-responses.dto';
import { JwtAuthGuard } from './guards/jwt.auth.guard';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  private readonly logger = new Logger();
  constructor(private readonly authService: AuthService) {}

  @ApiTags('Profiles')
  @ApiOperation({ summary: 'Get all user profiles' })
  @ApiResponse({ status: 200, description: 'Returns all user profiles' })
  @Get('profiles')
  async getProfiles() {
    return this.authService.getProfiles();
  }

  @ApiTags('OTP')
  @ApiOperation({ summary: 'Send OTP to phone number' })
  @ApiParam({
    name: 'phone',
    description: 'Phone number to send OTP to',
    example: '+1234567890',
  })
  @ApiResponse({ status: 200, description: 'OTP sent successfully' })
  @ApiResponse({ status: 400, description: 'Invalid phone number' })
  @Post('send-otp/:phone')
  async sendOtp(@Param('phone') phone: string) {
    return await this.authService.sendOtp(phone);
  }

  @ApiExcludeEndpoint()
  @Get('profiles/except/:id')
  async getProfilesExcept(@Param('id') id: string) {
    return this.authService.getProfilesExcept(id);
  }

  // @ApiExcludeEndpoint()
  @Post('profiles/like/except')
  async getProfilesLikeExcept(@Body() plDto: ProfilesLikeDto) {
    return this.authService.getProfilesLikeExcept(plDto);
  }

  @Post('profiles/suggestions')
  async getProfileSuggestions(@Body() psDto: ProfileSuggestionsDto) {
    return this.authService.getProfileSuggestions(psDto);
  }

  // @ApiTags('Authentication')
  @ApiOperation({ summary: 'User login with phone number' })
  @ApiParam({
    name: 'phone',
    description: 'Phone number for login',
    example: '+1234567890',
  })
  @ApiResponse({ status: 200, description: 'Login successful' })
  @ApiResponse({ status: 400, description: 'Invalid phone number' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  @Post('login/phone')
  async loginWithPhone2(@Body() loginDto: LoginDto, @Headers() headers) {
    const platform = headers['x-platform'];
    const response = await this.authService.loginWithPhone2(loginDto, platform);
    if (response != null && response['error'] !== null) {
      if (response instanceof AuthErrorResponse) {
        throw new HttpException(
          response ?? 'Bad request',
          HttpStatus.BAD_REQUEST,
        );
      }
    }
    if (response != null && response['statusCode'] === 500) {
      throw new HttpException(
        response['message'] ?? 'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    if (response != null && response['statusCode'] === 401) {
      if (response instanceof AuthErrorResponse) {
        throw new HttpException(
          response ?? 'Invalid credentials',
          HttpStatus.UNAUTHORIZED,
        );
      }
    }
    return response;
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Ban user' })
  @ApiBody({
    type: BannedProfileDto,
    description: 'Request body for user to be banned',
  })
  @ApiResponse({ status: 200, description: 'User banned successfully' })
  @ApiResponse({ status: 400, description: 'Failed to ban user' })
  @Post('ban')
  async banUser(@Body() bpDto: BannedProfileDto, @Req() req) {
    return await this.authService.banUser(bpDto, req.user.sub);
  }

  @ApiOperation({ summary: 'Reinstate user' })
  @ApiResponse({ status: 200, description: 'User reinstated successfully' })
  @ApiResponse({ status: 400, description: 'Failed to reinstate user' })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post('reinstate')
  async reinstateUser(@Body() rpDto: ReinstateProfileDto, @Req() req) {
    return await this.authService.reinstateUser(rpDto, req.user.sub);
  }

  @ApiBody({ type: OtpDto, description: 'OTP verification data' })
  @ApiResponse({ status: 200, description: 'OTP verified successfully' })
  @ApiResponse({ status: 400, description: 'Invalid OTP' })
  @Post('verify-otp')
  async verifyOtp(@Body() otpDto: OtpDto) {
    return await this.authService.verifyOtp(otpDto);
  }

  @ApiExcludeEndpoint()
  @Get('profiles/like_wallet_id/:id')
  async getProfilesLikeWalletID(@Param('id') id: string) {
    return this.authService.getProfilesLikeWalletID(id);
  }

  @ApiExcludeEndpoint()
  @Get('profiles/like/:id')
  async getProfilesLike(@Param('id') id: string) {
    return this.authService.getProfilesLike(id);
  }

  @ApiExcludeEndpoint()
  @Get('profiles/:id')
  async getProfile(@Param('id') id: string) {
    console.log('AuthGuard works 🎉');
    return this.authService.getProfile(id);
  }

  @ApiOperation({ summary: 'Fetch all banned users' })
  @Get('banned-users')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'Banned users fetched successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'No banned users found',
  })
  @ApiBearerAuth()
  async getBannedUsers(@Req() req, @Headers() headers) {
    return this.authService.getBannedUsers(req.user.sub, headers['x-platform']);
  }

  @ApiOperation({ summary: 'Fetch one banned user by id' })
  @Get('banned-users/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'Banned user fetched successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'No banned user found',
  })
  @ApiBearerAuth()
  async getBannedUser(@Param('id') id: string, @Req() req, @Headers() headers) {
    return this.authService.getBannedUser(
      id,
      req.user.sub,
      headers['x-platform'],
    );
  }

  // @ApiTags('User Registration')
  @ApiOperation({ summary: 'Create a new user account' })
  @ApiBody({ type: SignupDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'User created successfully',
    example: {
      status: 'account created',
      statusCode: 201,
      message: 'account created successfully',
      access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
      user: {
        id: '9608058d-106e-476d-9ead-4b26a1840690',
        email: 'user@example8.com',
        first_name: 'John',
        last_name: 'Doe',
        account_type: 'individual',
        dob: '1990-01-01',
        gender: 'MALE',
        wallet_id: '78a67d31-6487-4c44-bcec-c0408c0167bd',
        avatar: 'https://example.com/avatar.jpg',
        national_id_url: 'https://example.com/national_id.jpg',
        passport_url: 'https://example.com/passport.jpg',
        role: 'authenticated',
      },
      data: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
      error: null,
    },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data',
  })
  @ApiResponse({
    status: 422,
    description: 'Phone/Email number already exists',
  })
  @ApiResponse({ status: 422, description: 'Email already exists' })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Server error',
  })
  @Post('create-account')
  async signup(@Body() signupDto: SignupDto, @Headers() headers) {
    const platform = headers['x-platform'];
    return this.authService.signup(signupDto, platform);
  }

  @ApiExcludeEndpoint()
  @Patch('update-account/:id')
  async update(@Body() profile: MukaiProfile) {
    return this.authService.update(profile);
  }

  @ApiExcludeEndpoint()
  @Put('update-fcm/:id')
  async updateFCM(@Body() profile: Profile) {
    return this.authService.updateFCM(profile);
  }

  // @ApiTags('Authentication')
  @ApiOperation({ summary: 'User login with email and password' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Login successful',
    example: {
      status: 'account authenticated',
      statusCode: 200,
      message: 'account authenticated successfully',
      access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
      refresh_token: 'pz4n6kxax4fn',
      token_type: 'bearer',
      user: {
        id: '3cc4101d-7120-4765-8161-fa457d211c97',
        email: 'moyongqaa@gmail.com',
        phone: '263718439965',
        first_name: 'Ngqabutho',
        last_name: 'Moyo',
        account_type: 'coop-manager',
        role: 'authenticated',
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Invalid login credentials',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Server error',
  })
  @Post('login')
  async login(
    @Body() loginDto: LoginDto,
    @Headers() headers: Record<string, string>,
  ) {
    const platform = headers['x-platform'];
    this.logger.warn(`platorm: ${platform}`);
    const response = await this.authService.login(loginDto, platform);
    if (response != null && response['error'] !== null) {
      if (response instanceof AuthErrorResponse) {
        throw new HttpException(
          response ?? 'Bad request',
          HttpStatus.BAD_REQUEST,
        );
      }
    }
    if (response != null && response['statusCode'] === 500) {
      throw new HttpException(
        response['message'] ?? 'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    if (response != null && response['statusCode'] === 401) {
      if (response instanceof AuthErrorResponse) {
        throw new HttpException(
          response ?? 'Invalid credentials',
          HttpStatus.UNAUTHORIZED,
        );
      }
    }
    return response;
  }

  // @ApiTags('Authentication')
  @ApiOperation({ summary: 'User login with phone number' })
  @ApiParam({
    name: 'phone',
    description: 'Phone number for login',
    example: '+1234567890',
  })
  @ApiResponse({ status: 200, description: 'Login successful' })
  @ApiResponse({ status: 400, description: 'Invalid phone number' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  @Post('login/:phone')
  async loginWithPhone(@Param('phone') phone: string) {
    const response = await this.authService.loginWithPhone(phone);
    if (response != null && response['error'] !== null) {
      if (response instanceof AuthErrorResponse) {
        throw new HttpException(
          response ?? 'Bad request',
          HttpStatus.BAD_REQUEST,
        );
      }
    }
    if (response != null && response['statusCode'] === 500) {
      throw new HttpException(
        response['message'] ?? 'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    if (response != null && response['statusCode'] === 401) {
      if (response instanceof AuthErrorResponse) {
        throw new HttpException(
          response ?? 'Invalid credentials',
          HttpStatus.UNAUTHORIZED,
        );
      }
    }
    return response;
  }

  // @ApiTags('Password Management')
  @ApiOperation({ summary: 'Reset user password' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({ status: 200, description: 'Password reset successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  @Post('reset-password')
  async resetPassword(@Body() loginDto: LoginDto) {
    const response = await this.authService.resetPassword(loginDto);
    if (response != null && response['error'] !== null) {
      if (response instanceof AuthErrorResponse) {
        throw new HttpException(
          response ?? 'Bad request',
          HttpStatus.BAD_REQUEST,
        );
      }
    }
    if (response != null && response['statusCode'] === 500) {
      throw new HttpException(
        response['message'] ?? 'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    if (response != null && response['statusCode'] === 401) {
      if (response instanceof AuthErrorResponse) {
        throw new HttpException(
          response ?? 'Invalid credentials',
          HttpStatus.UNAUTHORIZED,
        );
      }
    }
    return response;
  }

  @ApiExcludeEndpoint()
  @Post('refresh')
  async refreshToken(@Body() body: { refreshToken: string }) {
    const response = await this.authService.refreshToken(body);
    return response;
  }

  @ApiTags('Authentication')
  @ApiOperation({ summary: 'User logout' })
  @ApiParam({
    name: 'id',
    description: 'User ID',
    example: '3cc4101d-7120-4765-8161-fa457d211c97',
  })
  @ApiResponse({ status: 200, description: 'User logged out successfully' })
  @Post('logout/:id')
  async logout(@Param('id') id: string) {
    return this.authService.logout(id);
  }

  @ApiExcludeEndpoint()
  @Post('validate-profile')
  async validate_profile(@Body() accessToken: AccessAccountDto) {
    return this.authService.validate_profile(accessToken);
  }

  @ApiTags('Security')
  @ApiOperation({ summary: 'Submit security questions' })
  @ApiBody({
    type: SecurityQuestionsDto,
    description: 'Security questions and answers',
  })
  @ApiResponse({
    status: 200,
    description: 'Security questions submitted successfully',
  })
  @ApiResponse({ status: 400, description: 'Invalid security questions data' })
  @Post('security-questions')
  async submitSecurityQuestions(@Body() sqDto: SecurityQuestionsDto) {
    return await this.authService.submitSecurityQuestions(sqDto);
  }

  // @ApiTags('Security')
  @ApiOperation({ summary: 'Get security questions for phone number' })
  @ApiParam({
    name: 'phone',
    description: 'Phone number to get security questions for',
    example: '+1234567890',
  })
  @ApiResponse({
    status: 200,
    description: 'Security questions retrieved successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Security questions not found for phone number',
  })
  @Get('security-questions/:phone')
  async getSecurityQuestions(@Param('phone') phone: string) {
    return await this.authService.getSecurityQuestions(phone);
  }
}
