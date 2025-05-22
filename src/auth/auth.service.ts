import { Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';
import { AccessAccountDto, LoginDto } from './dto/login.dto';
import { SignupDto } from './dto/signup.dto';
import { v4 as uuidv4 } from 'uuid';
import { PostgresRest } from 'src/common/postgresrest';
import { Profile } from 'src/user/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly postgresRest: PostgresRest,
    private readonly jwtService: JwtService,
  ) { }

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
          user: null
        };
      }
      console.log(' validate_profile user.id', user.id);
      // 3. Get profile with store information
      const { data: profileData, error: profileError } = await this.postgresRest
        .from('profiles')  // Explicit schema
        .select(`
        *,
        stores (*)
      `)
        .eq('id', user.id)
        .single();

      if (profileError) {
        return {
          status: 'failed',
          message: 'Profile not found',
          access_token: null,
          error: profileError,
          user: null
        };
      }

      const newPayload = {
        email: user.email,
        sub: user.id,
        role: user.role
      };
      const newToken = this.jwtService.sign(newPayload);

      return {
        status: 'success',
        message: 'Profile retrieved successfully',
        access_token: newToken,
        user: {
          ...profileData,
          email: user.email,
          role: user.role
        }
      };

    } catch (error) {
      if (error instanceof UnauthorizedException ||
        error instanceof NotFoundException) {
        return {
          status: 'failed',
          message: 'Profile not found',
          access_token: null,
          error: error,
          user: null
        };
      }
      return {
        status: 'failed',
        message: 'Failed to fetch profile',
        access_token: null,
        error: error,
        user: null
      };
    }
  }

  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto.email, loginDto.password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = {
      email: user.email,
      sub: user.id,
      role: user.role
    };
    const { error: profileError, data: profileData } = await this.postgresRest
      .from('profiles')
      .select('*, stores(*)').eq('id', user.id).single();
    const response_data = {
      status: 'account authenticated',
      message: 'account authenticated successfully',
      access_token: this.jwtService.sign(payload),
      user: profileData,
      error: null,
    }
    return response_data;
  }

  async signup(signupDto: SignupDto) {
    // Check if user exists in auth.users
    const { data: existingUser } = await this.postgresRest
      .auth_client('users')
      .select('id')
      .eq('email', signupDto.email)
      .limit(1)
      .single();

    if (existingUser) {
      throw new UnauthorizedException('Email already in use');
    }

    // Hash password and generate UUID
    const hashedPassword = await bcrypt.hash(signupDto.password, 10);
    const userId = uuidv4();
    const now = new Date().toISOString();
    const user_data = {
      id: userId,
      email: signupDto.email,
      encrypted_password: hashedPassword,
      role: 'authenticated',
      raw_user_meta_data: { first_name: signupDto.first_name },
      created_at: now,
      updated_at: now
    }


    // Create auth user in auth.users
    const { data: newAuthUser, error: authError } = await this.postgresRest
      .auth_client('users')
      .insert(user_data)
      .select('id, email, role, raw_user_meta_data')
      .single();

    if (authError) {
      throw new Error(`Auth user creation failed: ${authError.message}`);
    }

    // Create profile in public.profiles
    const { error: profileError } = await this.postgresRest
      .from('profiles')
      .insert({
        id: userId,
        auth_user_id: userId,
        email: signupDto.email,
        first_name: signupDto.first_name,
        last_name: signupDto.last_name,
        phone: signupDto.phone,
        account_type: signupDto.account_type,
        push_token: signupDto.push_token,
        national_id_url: signupDto.national_id_url,
        passport_url: signupDto.passport_url,
        avatar: signupDto.avatar,
        created_at: now,
        updated_at: now
      });

    if (profileError) {
      // Rollback auth user creation if profile fails
      await this.postgresRest.from('users').delete().eq('id', userId);
      throw new Error(`Profile creation failed: ${profileError.message}`);
    }

    // Generate JWT
    const payload = {
      email: newAuthUser.email,
      sub: newAuthUser.id,
      role: newAuthUser.role
    };

    return {
      status: 'account created',
      message: 'account created successfully',
      access_token: this.jwtService.sign(payload),
      user: {
        id: newAuthUser.id,
        email: newAuthUser.email,
        first_name: signupDto.first_name,
        last_name: signupDto.last_name,
        account_type: signupDto.account_type,
        role: newAuthUser.role
      },
      data: payload,
      error: null,

    };
  }
  async update(profile: Profile) {
    const now = new Date().toISOString();
    // Create profile in public.profiles

    const { error: profileError } = await this.postgresRest
      .from('profiles')
      .update({
        first_name: profile.first_name,
        last_name: profile.last_name,
        phone: profile.phone,
        account_type: profile.account_type,
        push_token: profile.push_token,
        national_id_url: profile.national_id_url,
        passport_url: profile.passport_url,
        avatar: profile.avatar,
        updated_at: now
      }).eq('id', profile.id);

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
        updated_at: now
      }).eq('id', profile.id);

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
}