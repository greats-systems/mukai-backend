/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { AccessAccountDto, LoginDto } from './dto/login.dto';
import { SignupDto } from './dto/signup.dto';
import { v4 as uuidv4 } from 'uuid';
import { PostgresRest } from 'src/common/postgresrest';
import { Profile } from 'src/user/entities/user.entity';
import { MukaiProfile } from 'src/user/entities/mukai-user.entity';
import { createClient } from '@supabase/supabase-js';
import { ConfigService } from '@nestjs/config';
import { error } from 'console';

@Injectable()
export class AuthService {
  private supabaseAdmin;

  constructor(
    private readonly postgresRest: PostgresRest,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {
    this.supabaseAdmin = createClient(
      process.env.ENV == 'local'
        ? process.env.LOCAL_SUPABASE_URL || ''
        : process.env.SUPABASE_URL || '',
      process.env.ENV == 'local'
        ? process.env.LOCAL_SERVICE_ROLE_KEY || ''
        : process.env.SUPABASE_SERVICE_ROLE_KEY || '',
    );
  }

  async validateUser(email: string, password: string): Promise<any> {
    // Query from auth.users schema
    console.log('email', email);
    console.log('password', password);

    const { data: user, error } = await this.postgresRest
      .auth_client('users')
      .select('*')
      .eq('email', email)
      .limit(1)
      .single();

    if (error) throw new Error(`Auth user lookup failed: ${error.message}`);
    if (!user) return null;

    const isValid = await bcrypt.compare(password, user.encrypted_password);

    if (isValid) {
      const { encrypted_password, ...result } = user;
      return result;
    }
    return null;
  }

  async validate_profile(accessAccountDto: AccessAccountDto) {
    try {
      console.log(' validate_profile user.id', accessAccountDto);
      const decoded = this.jwtService.verify(accessAccountDto.accessToken);
      if (!decoded?.sub) {
        throw new UnauthorizedException('Invalid token');
      }

      // 2. Get user from auth.users
      const { data: user, error: userError } = await this.postgresRest
        .auth_client('users')
        .select('id, email, role')
        .eq('id', decoded.sub)
        .single();

      if (userError || !user) {
        return {
          status: 'failed',
          message: 'User not found',
          access_token: null,
          error: userError,
          user: null,
        };
      }
      console.log(' validate_profile user.id', user.id);
      // 3. Get profile with store information
      const { data: profileData, error: profileError } = await this.postgresRest
        .from('profiles') // Explicit schema
        .select(
          `
        *,
        stores (*)
      `,
        )
        .eq('id', user.id)
        .single();

      if (profileError) {
        return {
          status: 'failed',
          message: 'Profile not found',
          access_token: null,
          error: profileError,
          user: null,
        };
      }

      const newPayload = {
        email: user.email,
        sub: user.id,
        role: user.role,
      };
      const newToken = this.jwtService.sign(newPayload);

      return {
        status: 'success',
        message: 'Profile retrieved successfully',
        access_token: newToken,
        user: {
          ...profileData,
          email: user.email,
          role: user.role,
        },
      };
    } catch (error) {
      if (
        error instanceof UnauthorizedException ||
        error instanceof NotFoundException
      ) {
        return {
          status: 'failed',
          message: 'Profile not found',
          access_token: null,
          error: error,
          user: null,
        };
      }
      return {
        status: 'failed',
        message: 'Failed to fetch profile',
        access_token: null,
        error: error,
        user: null,
      };
    }
  }

  async login(loginDto: LoginDto) {
    console.log('Logging in');
    try {
      // 1. First authenticate the user with email/password
      const {
        data: { user, session },
        error: authError,
      } = await this.supabaseAdmin.auth.signInWithPassword({
        email: loginDto.email,
        password: loginDto.password,
      });

      if (authError || !user) {
        throw new UnauthorizedException('Invalid credentials');
      }

      // 2. Get additional user profile data if needed
      const { data: profileData, error: profileError } = await this.postgresRest
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profileError) {
        console.error('Profile fetch error:', profileError);
        // Continue without profile data
      }
      const response = {
        status: 'account authenticated',
        statusCode: 200,
        message: 'account authenticated successfully',
        access_token: this.jwtService.sign({
          email: user.email,
          sub: user.id,
          role: user.role || 'authenticated',
        }),
        refresh_token: session?.refresh_token,
        token_type: 'bearer',
        user: {
          id: user.id,
          email: user.email,
          phone: profileData?.phone || null,
          first_name:
            profileData?.first_name || user.user_metadata?.first_name || '',
          last_name:
            profileData?.last_name || user.user_metadata?.last_name || '',
          account_type: profileData?.account_type || 'authenticated',
          created_at: profileData?.created_at || new Date().toISOString(),
          dob: profileData?.dob || null,
          gender: profileData?.gender || null,
          wallet_id: profileData?.wallet_id || null,
          cooperative_id: profileData?.cooperative_id || null,
          business_id: profileData?.business_id || null,
          updated_at: profileData?.updated_at || new Date().toISOString(),
          affliations: profileData?.affliations || null,
          coop_account_id: profileData?.coop_account_id || null,
          push_token: profileData?.push_token || '',
          avatar: profileData?.avatar || null,
          national_id_url: profileData?.national_id_url || null,
          passport_url: profileData?.passport_url || null,
          role: user.role || 'authenticated',
        },
        error: null,
      };

      return response;
    } catch (error) {
      console.error('Login error:', error);
      if (error instanceof UnauthorizedException) {
        return {
          data: null,
          error: {
            message: 'Invalid credentials',
            status: 401,
          },
        };
      }
      return {
        data: null,
        error: {
          message: 'Login failed',
          status: 500,
        },
      };
    }
  }

  async signup(signupDto: SignupDto) {
    // Check if user exists in auth.users
    try {
      const { data: existingUser } = await this.supabaseAdmin
        .from('users')
        .select('id')
        .eq('email', signupDto.email)
        .limit(1)
        .maybeSingle();

      if (existingUser) {
        throw new UnauthorizedException('Email already in use');
      }

      // Hash password and generate UUID
      const hashedPassword = await bcrypt.hash(signupDto.password, 10);
      // const userId = uuidv4();

      // Create auth user in auth.users
      const { data: newAuthUser, error: authError } =
        await this.supabaseAdmin.auth.admin.createUser({
          email: signupDto.email,
          password: signupDto.password,
          email_confirm: true, // This skips the verification email
          user_metadata: {
            first_name: signupDto.first_name,
            last_name: signupDto.last_name,
            account_type: signupDto.account_type,
          },
        });

      if (authError) {
        console.error('Auth creation error:', authError);
        throw new Error(`User creation failed: ${authError.message}`);
      }

      // Verify we got a valid user ID
      if (!newAuthUser?.user?.id) {
        throw new Error('Invalid user ID received from auth provider');
      }

      const now = new Date().toISOString();
      const user_data = {
        id: newAuthUser.user.id,
        id_text: newAuthUser.user.id,
        email: signupDto.email,
        encrypted_password: hashedPassword,
        role: 'authenticated',
        raw_user_meta_data: {
          first_name: signupDto.first_name,
          account_type: signupDto.account_type,
        },
        created_at: now,
        updated_at: now,
      };
      console.log('user_data:');
      console.log(user_data);

      // console.log(newAuthUser.user.id);

      const profileData = {
        id: newAuthUser.user.id,
        email: signupDto.email,
        phone: signupDto.phone,
        first_name: signupDto.first_name,
        last_name: signupDto.last_name,
        account_type: signupDto.account_type,
        dob: signupDto.dob,
        gender: signupDto.gender,
        wallet_id: signupDto.wallet_id,
        cooperative_id: signupDto.cooperative_id,
        business_id: signupDto.business_id,
        affiliations: signupDto.affiliations,
        coop_account_id: signupDto.coop_account_id,
        push_token: signupDto.push_token,
        avatar: signupDto.avatar,
        national_id_url: signupDto.national_id_url,
        passport_url: signupDto.passport_url,
      };

      // Create profile in public.profiles
      const { error: profileError } = await this.postgresRest
        .from('profiles')
        .insert(profileData);
      if (profileError) {
        // Rollback auth user creation if profile fails
        await this.postgresRest
          .from('users')
          .delete()
          .eq('id', newAuthUser.user.id);
        throw new Error(`Profile creation failed: ${profileError.message}`);
      }

      // Generate JWT
      const payload = {
        email: newAuthUser.user.email,
        sub: newAuthUser.user.id,
        role: newAuthUser.user.role,
      };

      console.log(payload);

      return {
        status: 'account created',
        statusCode: 201,
        message: 'account created successfully',
        access_token: this.jwtService.sign(payload),
        user: {
          id: newAuthUser.user.id,
          email: newAuthUser.user.email,
          first_name: signupDto.first_name,
          last_name: signupDto.last_name,
          account_type: signupDto.account_type,
          dob: signupDto.dob,
          gender: signupDto.gender,
          wallet_id: signupDto.wallet_id,
          cooperative_id: signupDto.cooperative_id,
          business_id: signupDto.business_id,
          affiliations: signupDto.affiliations,
          coop_account_id: signupDto.coop_account_id,
          push_token: signupDto.push_token,
          avatar: signupDto.avatar,
          national_id_url: signupDto.national_id_url,
          passport_url: signupDto.passport_url,
          role: newAuthUser.user.role,
        },
        data: payload,
        error: null,
      };
    } catch (e) {
      console.error(e);
    }
  }

  async getProfiles(): Promise<Profile[]> {
    try {
      const { data, error } = await this.postgresRest
        .from('profiles')
        .select('*')
        // .ilike('id', `%${suffix}`)
        .order('created_at', { ascending: false });

      if (error) {
        throw new Error(`Failed to fetch profiles: ${error.message}`);
      }

      if (!data || data.length === 0) {
        return []; // Return empty array rather than throwing if no profiles found
      }

      return data as Profile[];
    } catch (error) {
      console.error('Error in getProfiles:', error);
      throw new Error(
        error instanceof Error
          ? error.message
          : 'An unexpected error occurred while fetching profiles',
      );
    }
  }

  async getProfile(profile_id: string): Promise<Profile> {
    try {
      const { data, error } = await this.postgresRest
        .from('profiles')
        .select('*')
        .eq('id', profile_id)
        .single();

      if (error) {
        throw new Error(`Failed to fetch profiles: ${error.message}`);
      }

      return data as Profile;
    } catch (error) {
      console.error('Error in getProfiles:', error);
      throw new Error(
        error instanceof Error
          ? error.message
          : 'An unexpected error occurred while fetching profiles',
      );
    }
  }

  async getProfilesLike(id: string): Promise<Profile[]> {
    try {
      // Convert to lowercase for case-insensitive searc
      const searchTerm = id.toLowerCase();

      const { data, error } = await this.postgresRest
        .from('profiles')
        .select('*')
        // Cast UUID to text for pattern matching
        .ilike('id_text', `%${searchTerm}%`)
        .order('created_at', { ascending: false });

      if (error) {
        throw new Error(`Failed to fetch profiles: ${error.message}`);
      }

      return data?.length ? (data as Profile[]) : [];
    } catch (error) {
      // this.logger.error(`Error in getProfilesLike: ${error}`);
      throw new Error(
        error instanceof Error
          ? error.message
          : 'An unexpected error occurred while searching profiles',
      );
    }
  }

  async update(profile: MukaiProfile) {
    const now = new Date().toISOString();
    // Create profile in public.profiles

    const { error: profileError } = await this.postgresRest
      .from('profiles')
      .update({
        email: profile.email,
        phone: profile.phone,
        first_name: profile.first_name,
        last_name: profile.last_name,
        account_type: profile.account_type,
        dob: profile.dob,
        gender: profile.gender,
        wallet_id: profile.wallet_id,
        cooperative_id: profile.cooperative_id,
        business_id: profile.business_id,
        affiliations: profile.affiliations,
        coop_account_id: profile.coop_account_id,
        push_token: profile.push_token,
        avatar: profile.avatar,
        national_id_url: profile.national_id_url,
        passport_url: profile.passport_url,
        updated_at: now,
      })
      .eq('id', profile.id);

    if (profileError) {
      return {
        status: 'account not updated',
        message: 'account updated failed',
        error: profileError,
        data: null,
      };
    }
    return {
      status: 'account updated',
      message: 'account updated successfully',
      error: null,
      data: profile,
    };
  }

  async updateFCM(profile: Profile) {
    console.log('updateFCM', profile);

    const now = new Date().toISOString();
    const { error: profileError, data: profileData } = await this.postgresRest
      .from('profiles')
      .update({
        push_token: profile.push_token,
        updated_at: now,
      })
      .eq('id', profile.id);

    if (profileError) {
      console.log('updateFCM profileError', profileError);

      return {
        status: 'account not updated',
        message: 'account updated failed',
        error: profileError,
        data: null,
      };
    }
    console.log('updateFCM profileData', profileData);

    return {
      status: 'account updated',
      message: 'account updated successfully',
      error: null,
      data: profile,
    };
  }

  async logout(userId: string) {
    try {
      // 1. Validate the user ID format
      if (!this.isValidUuid(userId)) {
        throw new BadRequestException('Invalid user ID format');
      }

      // 2. First get the current user session to verify
      const {
        data: { user },
        error: userError,
      } = await this.supabaseAdmin.auth.admin.getUserById(userId);

      if (userError || !user) {
        throw new UnauthorizedException('User not found');
      }

      // 3. Invalidate ALL sessions for this user
      // const { error: authError } =
      //   await this.supabaseAdmin.auth.admin.signOut(userId);
      const { error: authError } = await this.supabaseAdmin.auth.signOut();

      if (authError) {
        throw new Error(`Session invalidation failed: ${authError.message}`);
      }

      // 4. Clear local profile data (optional)
      const now = new Date().toISOString();
      await this.postgresRest
        .from('profiles')
        .update({ push_token: null, updated_at: now })
        .eq('id', userId);

      return {
        status: 'success',
        message: 'Logged out successfully',
        error: null,
      };
    } catch (error) {
      console.error('Logout error:', error);
      throw new HttpException(
        error instanceof Error ? error.message : 'Logout failed',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  private isValidUuid(uuid: string): boolean {
    const regex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    return regex.test(uuid);
  }
  /*
  async logout(userId: string) {
    console.log('logout id:');
    console.log(userId['id']);
    try {
      // 1. Invalidate the user's session in Supabase
      const { error: authError } =
        await this.supabaseAdmin.auth.admin.signOut(userId);

      if (authError) {
        console.error('Supabase logout error:', authError);
        throw new Error('Failed to invalidate session');
      }

      // 2. Optionally update user's FCM token or other logout-related data
      // const now = new Date().toISOString();
      // const { error: profileError } = await this.postgresRest
      //   .from('profiles')
      //   .update({
      //     push_token: null, // Clear push token on logout
      //     updated_at: now,
      //   })
      //   .eq('id', userId);

      // if (profileError) {
      //   console.error('Profile update error during logout:', profileError);
      //   // You might choose to continue even if this fails
      // }
      console.log('Successfully logged out');

      return {
        status: 'success',
        message: 'Logged out successfully',
        error: null,
      };
    } catch (error) {
      console.error('Logout error:', error);
      throw new Error('Logout failed');
    }
  }
  */
}
