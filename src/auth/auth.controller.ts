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
} from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  AccessAccountDto,
  LoginDto,
  OtpDto,
  ProfilesLikeDto,
  SecurityQuestionsDto,
} from './dto/login.dto';
import { SignupDto } from './dto/signup.dto';
import { Profile } from 'src/user/entities/user.entity';
import { MukaiProfile } from 'src/user/entities/mukai-user.entity';
import {
  ApiBody,
  ApiExcludeEndpoint,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { AuthErrorResponse } from 'src/common/dto/auth-responses.dto';

/**
 * Controller for handling authentication-related operations.
 * Provides endpoints for user signup, login, logout, and profile management.
 */
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * Retrieves all user profiles.
   * @returns Promise<Profile[]> - Array of user profiles
   */
  // @ApiExcludeEndpoint()
  @Get('profiles')
  async getProfiles() {
    return this.authService.getProfiles();
  }

  @Post('send-otp/:phone')
  async sendOtp(@Param('phone') phone: string) {
    return await this.authService.sendOtp(phone);
  }

  @ApiExcludeEndpoint()
  @Get('profiles/except/:id')
  async getProfilesExcept(@Param('id') id: string) {
    return this.authService.getProfilesExcept(id);
  }

  @ApiExcludeEndpoint()
  @Post('profiles/like/except')
  async getProfilesLikeExcept(@Body() plDto: ProfilesLikeDto) {
    return this.authService.getProfilesLikeExcept(plDto);
  }

  @Post('verify-otp')
  async verifyOtp(@Body() otpDto: OtpDto) {
    return await this.authService.verifyOtp(otpDto);
  }
  /**
   * Retrieves user profiles similar to the given ID.
   * @param id - The ID to search similar profiles for
   * @returns Promise<Profile[]> - Array of matching user profiles
   */
  @ApiExcludeEndpoint()
  @Get('profiles/like_wallet_id/:id')
  async getProfilesLikeWalletID(@Param('id') id: string) {
    return this.authService.getProfilesLikeWalletID(id);
  }

  /**
   * Retrieves user profiles similar to the given ID.
   * @param id - The ID to search similar profiles for
   * @returns Promise<Profile[]> - Array of matching user profiles
   */
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

  /**
   * Creates a new user account.
   * @param signupDto - User signup data
   * @returns Promise<any> - Result of the signup operation
   */

  @ApiOperation({ summary: 'Create a new user' })
  @ApiBody({ type: SignupDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'User created successfully',
    // type: AuthSuccessResponse,
    example: {
      status: 'account created',
      statusCode: 201,
      message: 'account created successfully',
      access_token:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InVzZXJAZXhhbXBsZTguY29tIiwic3ViIjoiOTYwODA1OGQtMTA2ZS00NzZkLTllYWQtNGIyNmExODQwNjkwIiwicm9sZSI6ImF1dGhlbnRpY2F0ZWQiLCJpYXQiOjE3NTc5MzM1NjAsImV4cCI6MTc1Nzk3MzU2MH0.XVH-7Bn630Tkm8AsKIZZhe3DgE-jk4EQ8MXFt7ebGjE',
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
      data: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InVzZXJAZXhhbXBsZTguY29tIiwic3ViIjoiOTYwODA1OGQtMTA2ZS00NzZkLTllYWQtNGIyNmExODQwNjkwIiwicm9sZSI6ImF1dGhlbnRpY2F0ZWQiLCJpYXQiOjE3NTc5MzM1NjAsImV4cCI6MTc1Nzk3MzU2MH0.XVH-7Bn630Tkm8AsKIZZhe3DgE-jk4EQ8MXFt7ebGjE',
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
  @ApiResponse({
    status: 422,
    description: 'Email already exists',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Server error',
  })
  @Post('create-account')
  async signup(@Body() signupDto: SignupDto) {
    return this.authService.signup(signupDto);
  }

  /**
   * Updates an existing user account.
   * @param profile - Updated user profile data
   * @returns Promise<any> - Result of the update operation
   */
  @ApiExcludeEndpoint()
  @Patch('update-account/:id')
  async update(@Body() profile: MukaiProfile) {
    return this.authService.update(profile);
  }

  /**
   * Updates the FCM (Firebase Cloud Messaging) token for a user.
   * @param profile - User profile with updated FCM token
   * @returns Promise<any> - Result of the FCM update operation
   */
  @ApiExcludeEndpoint()
  @Put('update-fcm/:id')
  async updateFCM(@Body() profile: Profile) {
    return this.authService.updateFCM(profile);
  }

  @ApiOperation({ summary: 'Login' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Login successful',
    // type: AuthLoginSuccessResponse,
    example: {
      status: 'account authenticated',
      statusCode: 200,
      message: 'account authenticated successfully',
      access_token:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im1veW9uZ3FhYUBnbWFpbC5jb20iLCJzdWIiOiIzY2M0MTAxZC03MTIwLTQ3NjUtODE2MS1mYTQ1N2QyMTFjOTciLCJyb2xlIjoiYXV0aGVudGljYXRlZCIsImlhdCI6MTc1NzkzMzc0NywiZXhwIjoxNzU3OTczNzQ3fQ.RrvXQBnl1gm_8oSAk2ZvzL8u4yW2XxR1z6FPWY_a15I',
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
  async login(@Body() loginDto: LoginDto) {
    const response = await this.authService.login(loginDto);
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
    // this.logger.log(response);
  }

  @ApiOperation({ summary: 'Logout' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User logged out successfully',
  })
  @Post('logout/:id')
  async logout(@Param('id') id: string) {
    return this.authService.logout(id);
  }

  /**
   * Validates a user profile using an access token.
   * @param accessToken - Access token to validate
   * @returns Promise<any> - Validation result with user profile
   */
  @ApiExcludeEndpoint()
  @Post('validate-profile')
  async validate_profile(@Body() accessToken: AccessAccountDto) {
    return this.authService.validate_profile(accessToken);
  }

  @Post('security-questions')
  async submitSecurityQuestions(@Body() sqDto: SecurityQuestionsDto) {
    return await this.authService.submitSecurityQuestions(sqDto);
  }

  @Get('security-questions/:phone')
  async getSecurityQuestions(@Param('phone') phone: string) {
    return await this.authService.getSecurityQuestions(phone);
  }
}
