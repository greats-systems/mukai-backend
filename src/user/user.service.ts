/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable, Logger } from '@nestjs/common';
// import { CreateUserDto } from './dto/create-user.dto';
import { Profile, User } from './entities/user.entity';
import { PostgresRest } from 'src/common/postgresrest/postgresrest';
import { ErrorResponseDto } from 'src/common/dto/error-response.dto';
import { SignupDto } from 'src/auth/dto/signup.dto';
import { createClient } from '@supabase/supabase-js';
import { CreateSystemLogDto } from 'src/mukai/dto/create/create-system-logs.dto';
import * as CryptoJS from 'crypto-js';
import { LoginDto } from 'src/auth/dto/login.dto';

@Injectable()
export class UserService {
  private supabaseAdmin;
  private readonly logger = new Logger(UserService.name);
  constructor(private readonly postgresrest: PostgresRest) {
    this.supabaseAdmin = createClient(
      process.env.ENV == 'local'
        ? process.env.LOCAL_SUPABASE_URL || ''
        : process.env.SUPABASE_URL || '',
      process.env.ENV == 'local'
        ? process.env.LOCAL_SERVICE_ROLE_KEY || ''
        : process.env.SUPABASE_SERVICE_ROLE_KEY || '',
    );
  }

  async createUser(signupDto: SignupDto): Promise<object | undefined> {
    const slDto = new CreateSystemLogDto();
    /*
    const user: User = new User();
    user.name = createUserDto.name;
    user.age = createUserDto.age;
    user.email = createUserDto.email;
    user.username = createUserDto.username;
    user.password = createUserDto.password;
    user.gender = createUserDto.gender;
    */
    // 1. Check for existing users in parallel
    const [existingUser, existingPhoneNumber, existingNatID] =
      await Promise.all([
        this.supabaseAdmin
          .from('users')
          .select('id')
          .eq('email', signupDto.email)
          .limit(1)
          .maybeSingle(),
        this.postgresrest
          .from('profiles')
          .select('phone')
          .eq('phone', signupDto.phone)
          .limit(1)
          .maybeSingle(),
        this.postgresrest
          .from('profiles')
          .select('national_id_number')
          .eq('national_id_number', signupDto.national_id_number)
          .limit(1)
          .maybeSingle(),
      ]);

    if (existingUser.data) {
      this.logger.debug(
        `Duplicate email found: ${JSON.stringify(existingUser.data)}`,
      );
      signupDto.password = '*'.repeat(signupDto.password!.length);
      slDto.request = signupDto;
      slDto.response = {
        message: 'Duplicate email found',
        data: existingUser.data,
      };
      const { data: log, error: logError } = await this.postgresrest
        .from('system_logs')
        .insert(slDto)
        .select()
        .single();
      if (logError) {
        this.logger.error('Failed to create system log record', logError);
        return new ErrorResponseDto(
          400,
          'Failed to create system log record',
          logError,
        );
      }
      this.logger.warn('System log created', log);
      return new ErrorResponseDto(422, 'Email already in use');
    }

    if (existingPhoneNumber.data) {
      this.logger.debug(
        `Duplicate phone number found: ${JSON.stringify(existingPhoneNumber.data)}`,
      );
      signupDto.password = '*'.repeat(signupDto.password!.length);
      slDto.request = signupDto;
      slDto.response = {
        message: 'Duplicate phone number found',
        data: existingPhoneNumber.data,
      };
      const { data: log, error: logError } = await this.postgresrest
        .from('system_logs')
        .insert(slDto)
        .select()
        .single();
      if (logError) {
        this.logger.error('Failed to create system log record', logError);
        return new ErrorResponseDto(
          400,
          'Failed to create system log record',
          logError,
        );
      }
      this.logger.warn('System log created', log);
      return new ErrorResponseDto(422, 'Phone number already in use');
    }

    if (existingNatID.data) {
      this.logger.debug(
        `Duplicate national ID found: ${JSON.stringify(existingNatID.data)}`,
      );
      signupDto.password = '*'.repeat(signupDto.password!.length);
      slDto.request = signupDto;
      slDto.response = {
        message: 'Duplicate national ID  found',
        data: existingNatID.data,
      };
      const { data: log, error: logError } = await this.postgresrest
        .from('system_logs')
        .insert(slDto)
        .select()
        .single();
      if (logError) {
        this.logger.error('Failed to create system log record', logError);
        return new ErrorResponseDto(
          400,
          'Failed to create system log record',
          logError,
        );
      }
      this.logger.warn('System log created', log);
      return new ErrorResponseDto(422, 'National ID already in use');
    }

    // 2. Hash password for auth AND encrypt for profiles
    const plainText = signupDto.password!;
    const secretKey = process.env.SECRET_KEY || 'No secret key';
    const cipherText = CryptoJS.AES.encrypt(plainText, secretKey).toString();

    const now = new Date().toISOString();

    // 3. Create auth user (uses bcrypt hashing)
    const { data: newAuthUser, error: authError } =
      await this.supabaseAdmin.auth.admin.createUser({
        email: signupDto.email,
        password: signupDto.password, // This will be hashed by Supabase Auth
        email_confirm: true,
        user_metadata: {
          first_name: signupDto.first_name,
          last_name: signupDto.last_name,
          account_type: signupDto.account_type,
        },
      });

    if (authError) {
      console.error('Auth creation error:', authError);
      slDto.response = authError;
      const { data: log, error: logError } = await this.postgresrest
        .from('system_logs')
        .insert(slDto)
        .select()
        .single();
      if (logError) {
        this.logger.error('Failed to create system log record', logError);
        return new ErrorResponseDto(
          400,
          'Failed to create system log record',
          logError,
        );
      }
      this.logger.warn('System log created', log);
      return new ErrorResponseDto(400, 'User creation failed', authError);
    }

    if (!newAuthUser?.user?.id) {
      return new ErrorResponseDto(
        400,
        'Invalid user ID received from auth provider',
      );
    }

    const userId = newAuthUser.user.id;

    // 5. Prepare profile data with encrypted password
    const profileData = {
      id: userId,
      id_text: userId,
      email: signupDto.email,
      phone: signupDto.phone,
      first_name: signupDto.first_name,
      last_name: signupDto.last_name,
      account_type: signupDto.account_type,
      dob: signupDto.dob,
      gender: signupDto.gender,
      business_id: signupDto.business_id,
      coop_account_id: signupDto.coop_account_id,
      push_token: signupDto.push_token,
      avatar: signupDto.avatar,
      national_id_url: signupDto.national_id_url,
      passport_url: signupDto.passport_url,
      country: signupDto.country,
      city: signupDto.city,
      national_id_number: signupDto.national_id_number,
      date_of_birth: signupDto.date_of_birth,
      password: cipherText,
      // encryption_key_id: 'vault_managed_key',
      created_at: now,
      updated_at: now,
    };

    const new_user = await this.postgresrest
      .from('profiles')
      .insert(profileData)
      .single();
    if (new_user.data) {
      return new_user;
    } else {
      return;
    }
  }

  async findAllUser(): Promise<User[]> {
    try {
      const { data, error } = await this.postgresrest
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        this.logger.error('Error fetching users', error);
        return [];
      }

      return data as User[];
    } catch (error) {
      this.logger.error('Exception in findAllUser', error);
      return [];
    }
  }

  async viewUser(id: number): Promise<User | null> {
    try {
      const { data, error } = await this.postgresrest
        .from('profiles')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        this.logger.error(`Error fetching user ${id}`, error);
        return null;
      }

      return data as User;
    } catch (error) {
      this.logger.error(`Exception in viewUser for id ${id}`, error);
      return null;
    }
  }

  private async resetPassword(
    resetPasswordDto: LoginDto,
  ): Promise<object | ErrorResponseDto> {
    const slDto = new CreateSystemLogDto();

    // Locate user ID given their email
    this.logger.debug(
      `Resetting password using: ${JSON.stringify(resetPasswordDto)}`,
    );
    const { data: userData, error: userError } = await this.postgresrest
      .from('profiles')
      .select('id')
      .eq('phone', resetPasswordDto.phone)
      // .or(`phone.eq.${resetPasswordDto.phone}`)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();
    if (userError) {
      this.logger.error(
        `Error fetching email for password reset: ${JSON.stringify(userError)}`,
      );
      slDto.profile_email = resetPasswordDto.email;
      slDto.action = 'reset password';
      slDto.request = resetPasswordDto;
      slDto.response = userError;
      const { data: log, error: logError } = await this.postgresrest
        .from('system_logs')
        .insert(slDto)
        .select()
        .single();
      if (logError) {
        this.logger.error('Failed to insert system log record', logError);
        return new ErrorResponseDto(
          400,
          'Failed to insert system log record',
          logError,
        );
      }
      this.logger.warn('System log record created', log);
      return new ErrorResponseDto(400, userError.details);
    }
    const { data, error } = await this.supabaseAdmin.auth.admin.updateUserById(
      userData.id,
      { password: resetPasswordDto.password },
    );
    if (error) {
      this.logger.error(`Error updating password, ${JSON.stringify(error)}`);
      return new ErrorResponseDto(400, error.details);
    }

    // Update profile
    const plainText = resetPasswordDto.password;
    const secretKey = process.env.SECRET_KEY || 'No secret key';
    const cipherText = CryptoJS.AES.encrypt(plainText, secretKey).toString();
    const decipheredBytes = CryptoJS.AES.decrypt(cipherText, secretKey);
    const decipheredText = decipheredBytes.toString(CryptoJS.enc.Utf8);
    this.logger.debug(
      `Plain text: ${plainText} Cipher text: ${cipherText}: Deciphered text: ${decipheredText}`,
    );
    const { data: update, error: updateError } = await this.postgresrest
      .from('profiles')
      .update({ password: cipherText })
      .eq('id', userData.id)
      .select()
      .single();

    if (updateError) {
      this.logger.error(
        `Error updating profile, ${JSON.stringify(updateError)}`,
      );
      return new ErrorResponseDto(400, updateError.details);
    }

    this.logger.log(`Password reset response: ${JSON.stringify(update)}`);

    slDto.profile_id = userData.id;
    slDto.action = 'reset password';
    slDto.request = resetPasswordDto;
    slDto.response = data;
    const { data: log, error: logError } = await this.postgresrest
      .from('system_logs')
      .insert(slDto)
      .select()
      .single();
    if (logError) {
      this.logger.error('Failed to insert system log record', logError);
      return new ErrorResponseDto(
        400,
        'Failed to insert system log record',
        logError,
      );
    }
    this.logger.warn('System log record created', log);
    return data as object;
  }

  async updateUser(
    id: string,
    updateUserDto: SignupDto,
    logged_in_user_id?: string,
    platform?: string,
  ): Promise<User | ErrorResponseDto> {
    try {
      const slDto = new CreateSystemLogDto();
      slDto.profile_id = logged_in_user_id;
      slDto.action = 'update user';
      slDto.platform = platform;
      const { data, error } = await this.postgresrest
        .from('profiles')
        .update(updateUserDto)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        this.logger.error(`Error updating user ${id}`, error);
        return new ErrorResponseDto(400, error.details);
      }

      // Update the password
      if (updateUserDto.password) {
        const rpDto = new LoginDto();
        rpDto.email = updateUserDto.email!;
        rpDto.password = updateUserDto.password;
        const response = await this.resetPassword(rpDto);
        if (response instanceof ErrorResponseDto) {
          this.logger.error(
            `Error resetting password for user ${id}: ${response.message}`,
          );
          return response;
        }
      }

      return data as User;
    } catch (error) {
      this.logger.error(`Exception in updateUser for id ${id}`, error);
      return new ErrorResponseDto(500, error);
    }
  }

  async removeUser(id: number): Promise<boolean> {
    try {
      const { error } = await this.postgresrest
        .from('profiles')
        .delete()
        .eq('id', id)
        .single();

      if (error) {
        this.logger.error(`Error deleting user ${id}`, error);
        return false;
      }

      return true;
    } catch (error) {
      this.logger.error(`Exception in removeUser for id ${id}`, error);
      return false;
    }
  }

  async getUser(id: string): Promise<Profile | null> {
    if (!id) {
      this.logger.warn('getUser called with empty id');
      return null;
    }

    try {
      const { data: profile, error } = await this.postgresrest
        .from('profiles')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        this.logger.error('Database error fetching profile', {
          error,
          userId: id,
        });
        return null;
      }

      if (!profile) {
        this.logger.debug('Profile not found', { userId: id });
        return null;
      }

      return profile as Profile;
    } catch (error) {
      this.logger.error('Unexpected error in getUser', {
        error,
        userId: id,
      });
      return null;
    }
  }
}
