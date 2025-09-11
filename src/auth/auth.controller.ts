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
import { AccessAccountDto, LoginDto } from './dto/login.dto';
import { SignupDto } from './dto/signup.dto';
import { Profile } from 'src/user/entities/user.entity';
import { MukaiProfile } from 'src/user/entities/mukai-user.entity';
import {
  ApiBody,
  ApiExcludeEndpoint,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import {
  AuthErrorResponse,
  AuthLoginSuccessResponse,
  AuthSuccessResponse,
} from 'src/common/dto/auth-responses.dto';

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
  @ApiExcludeEndpoint()
  @Get('profiles')
  async getProfiles() {
    return this.authService.getProfiles();
  }

  @ApiExcludeEndpoint()
  @Get('profiles/except/:id')
  async getProfilesExcept(@Param('id') id: string) {
    return this.authService.getProfilesExcept(id);
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
    type: AuthSuccessResponse,
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
    type: AuthLoginSuccessResponse,
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

  /*
  @ApiOperation({ summary: 'Send OTP' })
  @ApiBody({ type: SignupDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'OTP sent',
    type: AuthSuccessResponse,
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Server error',
  })
  @Post('otp/send')
  async sendOtp(@Body() loginDto: LoginDto) {
    const response = await this.authService.sendOtp(loginDto.phone!);
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
  

  @ApiOperation({ summary: 'Send OTP' })
  @ApiBody({ type: SignupDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'OTP sent',
    type: AuthSuccessResponse,
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Server error',
  })
  @Post('otp/verify')
  async verifyOtp(@Body() loginDto: LoginDto) {
    const response = await this.authService.verifyOtp(
      loginDto.phone!,
      loginDto.otp!,
    );
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
    */
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
}
