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
  async getProfiles() {
    return this.authService.getProfiles();
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
  @Put('update-account/:id')
  async update(@Body() profile: MukaiProfile) {
    return this.authService.update(profile);
  }

  /**
   * Updates the FCM (Firebase Cloud Messaging) token for a user.
   * @param profile - User profile with updated FCM token
   * @returns Promise<any> - Result of the FCM update operation
   */
  @Put('update-fcm/:id')
  async updateFCM(@Body() profile: Profile) {
    return this.authService.updateFCM(profile);
  }

  /**
   * Authenticates a user and generates an access token.
   * @param loginDto - User login credentials
   * @returns Promise<any> - Authentication result with access token
   */
  @Post('login')
  @HttpCode(200)
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
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
