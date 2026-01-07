/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  Injectable,
  ExecutionContext,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from '../auth.service';

@Injectable()
export class JwtNotBannedGuard extends AuthGuard('jwt') {
  private readonly logger = new Logger(JwtNotBannedGuard.name);

  constructor(private authService: AuthService) {
    super();
    this.logger.warn(
      'Auth service initialized:',
      this.authService ? 'YES' : 'NO',
    );
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      // First, check JWT validity
      const canActivate = await super.canActivate(context);
      if (!canActivate) {
        return false;
      }

      const request = context.switchToHttp().getRequest();
      const user = request.user;

      this.logger.debug('User object from JWT:', JSON.stringify(user, null, 2));

      if (!user) {
        throw new ForbiddenException('User not found in request');
      }

      // Use 'sub' from your JWT payload (as shown in your logs)
      const userId = user.sub;

      if (!userId) {
        this.logger.error('User object structure:', user);
        throw new ForbiddenException('User ID not found in JWT payload');
      }

      this.logger.debug(`Checking ban status for user ID: ${userId}`);

      // Then check if user is banned
      const userData = await this.authService.getProfile(userId);

      // Check if userData is null or undefined
      if (!userData) {
        this.logger.error(`User profile not found for ID: ${userId}`);
        throw new ForbiddenException('User profile not found');
      }

      this.logger.debug(`User status: ${userData.status}`);

      if (userData.status === 'banned') {
        throw new ForbiddenException('Your account has been banned');
      }

      return true;
    } catch (error) {
      this.logger.error('Error in JwtNotBannedGuard:', error);

      // If it's already a ForbiddenException, re-throw it
      if (error instanceof ForbiddenException) {
        throw error;
      }

      // Otherwise, throw a generic forbidden error
      throw new ForbiddenException('Unable to verify account status');
    }
  }
}
