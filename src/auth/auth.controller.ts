/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
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
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AccessAccountDto, LoginDto } from './dto/login.dto';
import { SignupDto } from './dto/signup.dto';
import { Profile } from 'src/user/entities/user.entity';
import { MukaiProfile } from 'src/user/entities/mukai-user.entity';
import { ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from './guards/jwt.auth.guard';

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
  @Get('profiles')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async getProfiles() {
    return this.authService.getProfiles();
  }

  /**
   * Retrieves user profiles similar to the given ID.
   * @param id - The ID to search similar profiles for
   * @returns Promise<Profile[]> - Array of matching user profiles
   */
  @Get('profiles/like_wallet_id/:id')
  async getProfilesLikeWalletID(@Param('id') id: string) {
    return this.authService.getProfilesLikeWalletID(id);
  }

  /**
   * Retrieves user profiles similar to the given ID.
   * @param id - The ID to search similar profiles for
   * @returns Promise<Profile[]> - Array of matching user profiles
   */
  @Get('profiles/like/:id')
  async getProfilesLike(@Param('id') id: string) {
    return this.authService.getProfilesLike(id);
  }

  @Get('profiles/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async getProfile(@Param('id') id: string) {
    console.log('AuthGuard works 🎉');
    return this.authService.getProfile(id);
  }

  /**
   * Creates a new user account.
   * @param signupDto - User signup data
   * @returns Promise<any> - Result of the signup operation
   */
  @Post('create-account')
  async signup(@Body() signupDto: SignupDto) {
    return this.authService.signup(signupDto);
  }

  /**
   * Updates an existing user account.
   * @param profile - Updated user profile data
   * @returns Promise<any> - Result of the update operation
   */
  @Patch('update-account/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async update(@Body() profile: MukaiProfile) {
    return this.authService.update(profile);
  }

  /**
   * Updates the FCM (Firebase Cloud Messaging) token for a user.
   * @param profile - User profile with updated FCM token
   * @returns Promise<any> - Result of the FCM update operation
   */
  @Put('update-fcm/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async updateFCM(@Body() profile: Profile) {
    return this.authService.updateFCM(profile);
  }

  /**
   * Authenticates a user and generates an access token.
   * @param loginDto - User login credentials
   * @returns Promise<any> - Authentication result with access token
   */
  @Post('login')
  @ApiResponse({
    status: 200,
    description: 'Login successful',
    type: Object,
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid credentials',
    type: Object,
  })
  @ApiResponse({
    status: 500,
    description: 'Server error',
    type: Object,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request',
    type: Object,
  })
  async login(@Body() loginDto: LoginDto) {
    const response = await this.authService.login(loginDto);
    if (response['error'] !== null) {
      throw new HttpException(
        response['error']['message'] ?? 'Bad request',
        HttpStatus.BAD_REQUEST,
      );
    }
    if (response['statusCode'] === 500) {
      throw new HttpException(
        response['message'] ?? 'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    if (response['statusCode'] === 401) {
      throw new HttpException(
        response['error']?.message ?? 'Invalid credentials',
        HttpStatus.UNAUTHORIZED,
      );
    }
    return response;
  }

  @Post('refresh')
  async refreshToken(@Body() body: { refreshToken: string }) {
    const response = await this.authService.refreshToken(body);
    console.log(response);
  }

  /**
   * Logs out a user by invalidating their session.
   * @param id - ID of the user to logout
   * @returns Promise<any> - Result of the logout operation
   */
  @Post('logout/:id')
  async logout(@Param('id') id: string) {
    return this.authService.logout(id);
  }

  /**
   * Validates a user profile using an access token.
   * @param accessToken - Access token to validate
   * @returns Promise<any> - Validation result with user profile
   */
  @Post('validate-profile')
  async validate_profile(@Body() accessToken: AccessAccountDto) {
    return this.authService.validate_profile(accessToken);
  }
}
