/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-function-type */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  BadRequestException,
  Body,
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { AccessAccountDto, LoginDto, OtpDto, SecurityQuestionsDto } from './dto/login.dto';
import { SignupDto } from './dto/signup.dto';
import { PostgresRest } from 'src/common/postgresrest';
import { Profile } from 'src/user/entities/user.entity';
import { MukaiProfile } from 'src/user/entities/mukai-user.entity';
import { createClient } from '@supabase/supabase-js';
import { WalletsService } from 'src/mukai/services/wallets.service';
import { CreateWalletDto } from 'src/mukai/dto/create/create-wallet.dto';
import { ErrorResponseDto } from 'src/common/dto/error-response.dto';
import { ToroGateway } from 'src/common/toronet/auth_wallets';
import { SmileCashWalletService } from 'src/common/zb_smilecash_wallet/services/smilecash-wallet.service';
import { CreateWalletRequest } from 'src/common/zb_smilecash_wallet/requests/registration_and_auth.requests';
import { GeneralErrorResponseDto } from 'src/common/dto/general-error-response.dto';
import { BalanceEnquiryRequest } from 'src/common/zb_smilecash_wallet/requests/transactions.requests';
import { SuccessResponseDto } from 'src/common/dto/success-response.dto';
import {
  AuthErrorResponse,
  AuthLoginSuccessResponse,
  AuthSuccessResponse,
} from 'src/common/dto/auth-responses.dto';
import * as CryptoJS from 'crypto-js';
import { WhatsAppService } from 'src/common/whatsapp/whatsapp.service';
import { WhatsAppRequestDto } from 'src/common/whatsapp/requests/whatsapp.requests.dto';
import { first } from 'rxjs';
import { UpdateWalletDto } from 'src/mukai/dto/update/update-wallet.dto';
import { Auth } from 'firebase-admin/lib/auth/auth';
import { MessagingController } from 'src/messagings/messaging.controller';
import { MessagingsService } from 'src/messagings/messagings.service';
import { NotifyTextService } from 'src/messagings/notify_text.service';
import { messaging } from 'firebase-admin';
// import gen from 'supabase/apps/docs/generator/api';

function initLogger(funcname: Function): Logger {
  return new Logger(funcname.name);
}

function generateRandom6DigitNumber() {
  // Generate a random number between 100,000 (inclusive) and 999,999 (inclusive)
  return Math.floor(100000 + Math.random() * 900000);
}

@Injectable()
export class AuthService {
  private supabaseAdmin;
  private readonly logger = initLogger(AuthService);
  constructor(
    private readonly postgresRest: PostgresRest,
    private readonly jwtService: JwtService,
    private readonly toroGateway: ToroGateway,
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

  async sendOtp(phone: string): Promise<boolean | GeneralErrorResponseDto> {
    try {
      // Check if the user with that phone number exists
      const { data: profile, error: profileError } = await this.postgresRest
        .from('profiles')
        .select()
        .eq('phone', phone)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();
      if (profileError) {
        return new ErrorResponseDto(400, 'Failed to fetch profile ID for OTP', profileError);
      }

      if (!profile || !profile.id) {
        return new ErrorResponseDto(404, 'Profile not found for provided phone number');
      }
      // this.logger.debug(`Profile found: ${JSON.stringify(profile)}`);
      const nts = new NotifyTextService();

      this.logger.debug('Sending OTP');
      const now = new Date();
      const futureDate = new Date(now);
      futureDate.setMinutes(now.getMinutes() + 5); // Add 5 minutes
      const expiresIn = futureDate.toISOString();
      const plainText = generateRandom6DigitNumber().toString();
      const secretKey = process.env.SECRET_KEY || 'No secret key';
      const cipherText = CryptoJS.AES.encrypt(plainText, secretKey).toString();
      const decipheredBytes = CryptoJS.AES.decrypt(cipherText, secretKey);
      const decipheredText = decipheredBytes.toString(CryptoJS.enc.Utf8);
      this.logger.debug(
        `Plain text: ${plainText} Cipher text: ${cipherText}: Deciphered text: ${decipheredText}`,
      );
      const otpBody = {
        sender: '0777757603',
        scheduled_time: 'unknown',
        smslist: [{ message: plainText, mobiles: phone, client_ref: phone }],
      };

      // Send OTP
      await nts.sendSms(otpBody);

      // Insert into database (useful when verifying)
      const { data, error } = await this.postgresRest
        .from('otps')
        .insert({
          otp: cipherText,
          expires_in: expiresIn,
          phone: phone,
        })
        .select()
        .single();
      if (error) {
        this.logger.log(`Failed to insert into otps: ${JSON.stringify(error)}`);
        return new GeneralErrorResponseDto(
          400,
          'Failed to insert into otps',
          error,
        );
      }
      return true;
    } catch (e) {
      this.logger.error(`sendOtp error: ${e}`);
      return new GeneralErrorResponseDto(500, 'sendOtp error', e);
    }
  }

  async verifyOtp(otpDto: OtpDto): Promise<boolean | GeneralErrorResponseDto> {
    try {
      this.logger.debug(`Verifying OTP: ${JSON.stringify(otpDto)}`);
      const secretKey = process.env.SECRET_KEY || 'No secret key';

      // Get the stored OTP record for this phone
      const { data, error } = await this.postgresRest
        .from('otps')
        .select()
        .eq('phone', otpDto.phone)
        .order('created_at', { ascending: false })
        .limit(1);

      if (error || !data) {
        this.logger.error(`Failed to fetch from otps: ${JSON.stringify(error)}`);
        return new GeneralErrorResponseDto(400, 'Failed to fetch from otps', error as object);
      }

      this.logger.debug(`verifyOTP record: ${JSON.stringify(data)}`);

      // Decrypt the stored OTP (cipherText from database)
      const bytes = CryptoJS.AES.decrypt(data[0].otp, secretKey);
      const decipheredText = bytes.toString(CryptoJS.enc.Utf8);

      this.logger.debug(`User entered: ${otpDto.otp}, Decrypted stored: ${decipheredText}`);

      // Check if OTP matches and is not expired
      const now = new Date();
      const isExpired = now > new Date(data[0].expires_in);

      this.logger.debug(`OTP expired? ${isExpired}`);

      this.logger.debug(`${decipheredText === otpDto.otp}`);
      this.logger.debug(`${!isExpired}`);
      if (decipheredText === otpDto.otp && !isExpired) {
        return true;
      }

      return false;
    } catch (e) {
      this.logger.error(`verifyOtp error: ${e}`);
      return new GeneralErrorResponseDto(500, 'verifyOtp error', e);
    }
  }

  async validateUser(email: string, password: string): Promise<any> {
    // Query from auth.users schema
    this.logger.log('email', email);
    this.logger.log('password', password);

    const { data: user, error } = await this.postgresRest
      .auth_client('users')
      .select('*')
      .eq('email', email)
      .limit(1)
      .maybeSingle();

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
      this.logger.log(' validate_profile user.id', accessAccountDto);
      const decoded = this.jwtService.verify(accessAccountDto.accessToken);
      if (!decoded?.sub) {
        throw new UnauthorizedException('Invalid token');
      }

      // 2. Get user from auth.users
      const { data: user, error: userError } = await this.postgresRest
        .auth_client('users')
        .select('id, email, role')
        .eq('id', decoded.sub)
        .maybeSingle();

      if (userError || !user) {
        return {
          status: 'failed',
          message: 'User not found',
          access_token: null,
          error: userError,
          user: null,
        };
      }
      this.logger.log(' validate_profile user.id', user.id);
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
        .maybeSingle();

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
    this.logger.log(JSON.stringify(loginDto));
    try {
      // 1. Authenticate user
      const {
        data: { user, session },
        error: authError,
      } = await this.supabaseAdmin.auth.signInWithPassword({
        email: loginDto.email,
        password: loginDto.password,
      });

      if (authError || !user) {
        this.logger.log(`No user found: ${JSON.stringify(authError)} ${!user}`);
        return {
          status: 'failed',
          message: 'Invalid credentials',
          statusCode: 401,
        } as AuthErrorResponse;
      }

      // 2. Get essential profile data only
      const { data: profileData, error: profileError } = await this.postgresRest
        .from('profiles')
        .select('id, wallet_id, phone, first_name, last_name, account_type')
        .eq('id', user.id)
        .maybeSingle();

      if (profileError) {
        console.error('Profile fetch error:', profileError);
      }

      // 3. Parallel balance enquiries with timeout
      const scwService = new SmileCashWalletService(this.postgresRest);
      const walletPhone = profileData?.phone;

      const balancePromises: Promise<SuccessResponseDto | null>[] = [];
      if (walletPhone) {
        const balanceParamsUSD: BalanceEnquiryRequest = {
          transactorMobile: walletPhone,
          currency: 'USD',
          channel: 'USSD',
          transactionId: '',
        };

        const balanceParamsZWG: BalanceEnquiryRequest = {
          transactorMobile: walletPhone,
          currency: 'ZWG',
          channel: 'USSD',
          transactionId: '',
        };

        // Execute balance enquiries in parallel with timeout
        balancePromises.push(
          Promise.race<SuccessResponseDto | null>([
            scwService.balanceEnquiry(balanceParamsUSD),
            new Promise<null>((resolve) =>
              setTimeout(() => resolve(null), 5000),
            ), // 5s timeout
          ]),
          Promise.race<SuccessResponseDto | null>([
            scwService.balanceEnquiry(balanceParamsZWG),
            new Promise<null>((resolve) =>
              setTimeout(() => resolve(null), 5000),
            ), // 5s timeout
          ]),
        );
      }

      const [balanceUSD, balanceZWG] =
        await Promise.allSettled(balancePromises);

      if (
        balanceUSD.status === 'fulfilled' &&
        balanceUSD.value instanceof SuccessResponseDto &&
        balanceZWG.status === 'fulfilled' &&
        balanceZWG.value instanceof SuccessResponseDto
      ) {
        this.logger.log(
          `balanceUSD: ${JSON.stringify(balanceUSD.value.data.data.billerResponse.balance)}`,
        );
        const updateDto = new UpdateWalletDto();
        updateDto.id = profileData!.wallet_id;
        updateDto.balance = balanceUSD.value.data.data.billerResponse.balance;
        updateDto.balance_zwg =
          balanceZWG.value.data.data.billerResponse.balance;
        const walletService = new WalletsService(this.postgresRest);
        const walletResponse = await walletService.updateWallet(
          updateDto.id!,
          updateDto,
        );
        this.logger.log(`walletResponse: ${JSON.stringify(walletResponse)}`);
      }

      // 4. Build minimal response
      // const user = await this.validateUser(loginDto);
      // const session = await this.createSession(user.id);

      const response: AuthLoginSuccessResponse = {
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
          first_name: profileData?.first_name || '',
          last_name: profileData?.last_name || '',
          account_type: profileData?.account_type || 'authenticated',
          wallet_id: profileData?.wallet_id,
          role: user.role || 'authenticated',
        },
        data: undefined, // Explicitly set as undefined
        // error: null
      };

      return response;
    } catch (error) {
      console.error('Login error:', error);
      return {
        status: 'failed',
        message: 'Login failed. Please try again.',
        statusCode: 500,
      };
    }
  }

  async loginWithPhone(phone: string): Promise<object | ErrorResponseDto> {
    // this.logger.log(JSON.stringify(loginDto));
    try {
      const secretKey = process.env.SECRET_KEY || 'No secret key';
      const { data, error } = await this.postgresRest
        .from('profiles')
        .select('email, password')
        .eq('phone', phone)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error) {
        this.logger.error('Profile fetch error:', error);
        return new ErrorResponseDto(400, 'Profile fetch error', error);
      }

      this.logger.debug(`User data: ${JSON.stringify(data)}`);

      // 2. Convert bytea/hex format back to the original Base64 string
      let encryptedPassword: string;

      if (typeof data.password === 'string' && data.password.startsWith('\\x')) {
        // PostgreSQL bytea hex format contains the Base64 string as hex
        const hexString = data.password.substring(2); // Remove '\x' prefix
        const buffer = Buffer.from(hexString, 'hex');
        encryptedPassword = buffer.toString('utf8'); // This gives us the Base64 string

        this.logger.debug(`Original hex: ${data.password}`);
        this.logger.debug(`Decoded Base64: ${encryptedPassword}`);
      } else {
        encryptedPassword = data.password;
      }

      // 3. Decrypt password (same as your OTP verification)
      this.logger.debug(`Attempting to decrypt: ${encryptedPassword}`);
      const bytes = CryptoJS.AES.decrypt(encryptedPassword, secretKey);
      const decipheredText = bytes.toString(CryptoJS.enc.Utf8);

      this.logger.debug(`Decryption result bytes: ${bytes.toString()}`);
      this.logger.debug(`Decrypted text: "${decipheredText}"`);

      if (!decipheredText) {
        this.logger.error(`Failed to decrypt password. Possible issues:
        - Wrong secret key
        - Data corrupted
        - Encryption method mismatch`);
        return {
          status: 'failed',
          message: 'Invalid credentials',
          statusCode: 401,
        } as AuthErrorResponse;
      }

      this.logger.debug(`Successfully decrypted password: ${decipheredText}`);

      // Continue with login logic...
      const {
        data: { user, session },
        error: authError,
      } = await this.supabaseAdmin.auth.signInWithPassword({
        email: data.email,
        password: decipheredText,
      });

      if (authError || !user) {
        this.logger.log(`No user found: ${JSON.stringify(authError)} ${!user}`);
        return {
          status: 'failed',
          message: 'Invalid credentials',
          statusCode: 401,
        } as AuthErrorResponse;
      }

      // 2. Get essential profile data only
      const { data: profileData, error: profileError } = await this.postgresRest
        .from('profiles')
        .select('id, wallet_id, phone, first_name, last_name, account_type')
        .eq('id', user.id)
        .maybeSingle();

      if (profileError) {
        console.error('Profile fetch error:', profileError);
      }

      // 3. Parallel balance enquiries with timeout
      const scwService = new SmileCashWalletService(this.postgresRest);
      const walletPhone = profileData?.phone;

      const balancePromises: Promise<SuccessResponseDto | null>[] = [];
      if (walletPhone) {
        const balanceParamsUSD: BalanceEnquiryRequest = {
          transactorMobile: walletPhone,
          currency: 'USD',
          channel: 'USSD',
          transactionId: '',
        };

        const balanceParamsZWG: BalanceEnquiryRequest = {
          transactorMobile: walletPhone,
          currency: 'ZWG',
          channel: 'USSD',
          transactionId: '',
        };

        // Execute balance enquiries in parallel with timeout
        balancePromises.push(
          Promise.race<SuccessResponseDto | null>([
            scwService.balanceEnquiry(balanceParamsUSD),
            new Promise<null>((resolve) =>
              setTimeout(() => resolve(null), 5000),
            ), // 5s timeout
          ]),
          Promise.race<SuccessResponseDto | null>([
            scwService.balanceEnquiry(balanceParamsZWG),
            new Promise<null>((resolve) =>
              setTimeout(() => resolve(null), 5000),
            ), // 5s timeout
          ]),
        );
      }

      const [balanceUSD, balanceZWG] =
        await Promise.allSettled(balancePromises);

      if (
        balanceUSD.status === 'fulfilled' &&
        balanceUSD.value instanceof SuccessResponseDto &&
        balanceZWG.status === 'fulfilled' &&
        balanceZWG.value instanceof SuccessResponseDto
      ) {
        this.logger.log(
          `balanceUSD: ${JSON.stringify(balanceUSD.value.data.data.billerResponse.balance)}`,
        );
        const updateDto = new UpdateWalletDto();
        updateDto.id = profileData!.wallet_id;
        updateDto.balance = balanceUSD.value.data.data.billerResponse.balance;
        updateDto.balance_zwg =
          balanceZWG.value.data.data.billerResponse.balance;
        const walletService = new WalletsService(this.postgresRest);
        const walletResponse = await walletService.updateWallet(
          updateDto.id!,
          updateDto,
        );
        this.logger.log(`walletResponse: ${JSON.stringify(walletResponse)}`);
      }

      // 4. Build minimal response
      // const user = await this.validateUser(loginDto);
      // const session = await this.createSession(user.id);

      const response: AuthLoginSuccessResponse = {
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
          first_name: profileData?.first_name || '',
          last_name: profileData?.last_name || '',
          account_type: profileData?.account_type || 'authenticated',
          wallet_id: profileData?.wallet_id,
          role: user.role || 'authenticated',
        },
        data: undefined, // Explicitly set as undefined
        // error: null
      };

      return response;
    } catch (error) {
      console.error('Login error:', error);
      return {
        status: 'failed',
        message: 'Login failed. Please try again.',
        statusCode: 500,
      };
    }
  }

  async resetPassword(
    resetPasswordDto: LoginDto,
  ): Promise<object | ErrorResponseDto> {
    // Locate user ID given their email
    this.logger.debug(`Resetting password using: ${JSON.stringify(resetPasswordDto)}`);
    const { data: userData, error: userError } = await this.postgresRest
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
    this.logger.log(`Password reset response: ${JSON.stringify(data)}`);
    return data as object;
  }

  async signup(signupDto: SignupDto): Promise<object | undefined> {
    const walletsService = new WalletsService(this.postgresRest);
    const scwService = new SmileCashWalletService(this.postgresRest);
    const createWalletDto = new CreateWalletDto();

    try {
      this.logger.log('Creating transaction...', signupDto);

      // 1. Check for existing users in parallel
      const [existingUser, existingPhoneNumber, existingNatID] =
        await Promise.all([
          this.supabaseAdmin
            .from('users')
            .select('id')
            .eq('email', signupDto.email)
            .limit(1)
            .maybeSingle(),
          this.postgresRest
            .from('profiles')
            .select('phone')
            .eq('phone', signupDto.phone)
            .limit(1)
            .maybeSingle(),
          this.postgresRest
            .from('profiles')
            .select('national_id_number')
            .eq('national_id_number', signupDto.national_id_number)
            .limit(1)
            .maybeSingle(),
        ]);


      if (existingPhoneNumber.data) {
        this.logger.debug(
          `Duplicate phone number found: ${JSON.stringify(existingPhoneNumber.data)}`,
        );
        return new ErrorResponseDto(422, 'Phone number already in use');
      }
      if (existingNatID.data) {
        this.logger.debug(
          `Duplicate national ID found: ${JSON.stringify(existingNatID.data)}`,
        );
        return new ErrorResponseDto(422, 'National ID already in use');
      }


      // 2. Hash password for auth AND encrypt for profiles
      const plainText = signupDto.password;
      const secretKey = process.env.SECRET_KEY || 'No secret key';
      const cipherText = CryptoJS.AES.encrypt(plainText, secretKey).toString();
      const decipheredBytes = CryptoJS.AES.decrypt(cipherText, secretKey);
      const decipheredText = decipheredBytes.toString(CryptoJS.enc.Utf8);
      this.logger.debug(
        `Plain text: ${plainText} Cipher text: ${cipherText}: Deciphered text: ${decipheredText}`,
      );
      // const hashedPassword = await bcrypt.hash(signupDto.password, 10);

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
        return new ErrorResponseDto(400, 'User creation failed', authError);
      }

      if (!newAuthUser?.user?.id) {
        return new ErrorResponseDto(
          400,
          'Invalid user ID received from auth provider',
        );
      }

      const userId = newAuthUser.user.id;

      // 4. Encrypt password for storage in profiles table
      /*
      const { data: encryptedPassword, error: encryptError } = await this.postgresRest
        .rpc('encrypt_user_password', { plain_text: signupDto.password });

      if (encryptError) {
        this.logger.error('Password encryption failed:', encryptError);
        // Clean up auth user since we can't create profile properly
        await this.supabaseAdmin.auth.admin.deleteUser(userId);
        return new ErrorResponseDto(500, 'Password encryption failed', encryptError);
      }
      */

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

      // 6. Create profile and check balances in parallel
      const [profileResult, balanceUSD, balanceZWG] = await Promise.allSettled([
        this.postgresRest.from('profiles').insert(profileData),
        scwService.balanceEnquiry({
          transactorMobile: signupDto.phone,
          currency: 'USD',
          channel: 'USSD',
        } as BalanceEnquiryRequest),
        scwService.balanceEnquiry({
          transactorMobile: signupDto.phone,
          currency: 'ZWG',
          channel: 'USSD',
        } as BalanceEnquiryRequest),
      ]);

      // Check if profile creation failed
      if (profileResult.status === 'rejected' || profileResult.value.error) {
        await this.supabaseAdmin.auth.admin.deleteUser(userId);
        return new ErrorResponseDto(
          500,
          'Profile creation failed',
          profileResult.status === 'rejected'
            ? profileResult.reason
            : profileResult.value.error,
        );
      }

      // 7. Setup wallet with balance data
      createWalletDto.profile_id = userId;
      createWalletDto.default_currency = 'usd';
      createWalletDto.is_group_wallet = false;
      createWalletDto.is_active = true;
      createWalletDto.status = 'active';
      createWalletDto.phone = signupDto.phone;

      // Handle balance responses
      if (
        balanceUSD instanceof SuccessResponseDto &&
        balanceZWG instanceof SuccessResponseDto
      ) {
        createWalletDto.balance = balanceUSD.data.data.billerResponse.balance;
        createWalletDto.balance_zwg =
          balanceZWG.data.data.billerResponse.balance;
      } else {
        createWalletDto.balance = 0.0;
        const scwRegParams = {
          firstName: signupDto.first_name,
          lastName: signupDto.last_name,
          mobile: signupDto.phone,
          dateOfBirth: signupDto.date_of_birth,
          idNumber: signupDto.national_id_number,
          gender: signupDto.gender.toUpperCase(),
          source: 'SmileSACCO',
        } as CreateWalletRequest;
        this.logger.log(
          `Registering new SmileCash wallet: ${JSON.stringify(scwRegParams)}`,
        );
        const scwRegResponse = await scwService.createWallet(scwRegParams);
        if (scwRegResponse instanceof GeneralErrorResponseDto) {
          if (scwRegResponse.statusCode != 409) {
            this.logger.error(
              `SmileCash wallet registration failed: ${JSON.stringify(
                scwRegResponse,
              )}`,
            );
            return scwRegResponse;
          }
        }
        this.logger.log(
          `SmileCash wallet registered: ${JSON.stringify(scwRegResponse)}`,
        );
      }

      // 8. Create wallet
      const walletResponse = await walletsService.createWallet(createWalletDto);

      // 9. Update profile with wallet ID (non-blocking)
      this.logger.log(
        `Updating profile with wallet ID...${JSON.stringify(walletResponse)}`,
      );
      this.logger.log('Wallet was created successfully. Updating account...');
      await this.postgresRest
        .from('profiles')
        .update({
          wallet_id: walletResponse['data']['id'],
          wallet_id_text: walletResponse['data']['id'],
        })
        .eq('id', userId);

      // 10. Create ToroNet key in background (non-blocking)
      this._createToroNetKeyInBackground(userId).catch((error) =>
        this.logger.error('ToroNet key creation failed:', error),
      );

      // 11. Generate JWT and return response
      const payload = {
        email: newAuthUser.user.email,
        sub: userId,
        role: newAuthUser.user.role,
      };

      return {
        status: 'account created',
        statusCode: 201,
        message: 'account created successfully',
        access_token: this.jwtService.sign(payload),
        user: {
          id: userId,
          email: newAuthUser.user.email,
          first_name: signupDto.first_name,
          last_name: signupDto.last_name,
          account_type: signupDto.account_type,
          dob: signupDto.dob,
          gender: signupDto.gender,
          wallet_id: walletResponse['data']['id'],
          business_id: signupDto.business_id,
          coop_account_id: signupDto.coop_account_id,
          push_token: signupDto.push_token,
          avatar: signupDto.avatar,
          national_id_url: signupDto.national_id_url,
          passport_url: signupDto.passport_url,
          role: newAuthUser.user.role,
        },
        data: this.jwtService.sign(payload),
        error: null,
      } as AuthSuccessResponse;
    } catch (e) {
      console.error(e);
      return new ErrorResponseDto(
        500,
        'Internal server error during signup',
        e,
      );
    }
  }

  // Helper method for background ToroNet key creation
  private async _createToroNetKeyInBackground(userId: string): Promise<void> {
    try {
      const toronetResponse = await this.toroGateway.createKey(userId);
      this.logger.log('toronetResponse:', toronetResponse['message']);

      if (toronetResponse['result'] === true) {
        await this.postgresRest
          .from('wallets')
          .update({
            toro_wallet_address: toronetResponse['address'],
            toro_wallet_token_balance: 0.0,
          })
          .eq('profile_id', userId);
        this.logger.log('ToroNet key created successfully');
      }
    } catch (error) {
      this.logger.error('ToroNet key creation failed:', error);
      throw error; // Re-throw for proper error handling if needed
    }
  }
  async refreshToken(@Body() body: { refreshToken: string }) {
    try {
      const { data, error } = await this.supabaseAdmin.auth.refreshSession({
        refresh_token: body.refreshToken,
      });

      if (error || !data.session) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      return {
        accessToken: data.session.access_token,
        refreshToken: data.session.refresh_token,
        expiresAt: data.session.expires_at,
        userId: data.user.id,
        email: data.user.email,
      };
    } catch (error) {
      throw new UnauthorizedException('Session refresh failed');
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

  async getProfilesExcept(id: string): Promise<Profile[]> {
    try {
      const { data, error } = await this.postgresRest
        .from('profiles')
        .select('*')
        .neq('id', id)
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
        .maybeSingle();

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

  async submitSecurityQuestions(sqDto: SecurityQuestionsDto): Promise<boolean | ErrorResponseDto> {
    try {
      const { data, error } = await this.postgresRest.from('security_questions').insert(sqDto).select().single();
      if (error) {
        return new ErrorResponseDto(400, 'Error creating security questions', error);
      }
      this.logger.debug(`Record created: ${JSON.stringify(data)}`);
      return true;
    }
    catch (e) {
      this.logger.error(`Error in submitSecurityQuestions: ${e}`);
      // throw new Error(
      //   error instanceof Error
      //     ? error.message
      //     : 'An unexpected error occurred while searching profiles',
      // );
      return new ErrorResponseDto(
        500,
        'An unexpected error occurred while searching profiles error',
        e,
      );
    }
  }

  async getSecurityQuestions(phone: string): Promise<object | ErrorResponseDto> {
    try {
      // Get the profile ID first
      const { data: profile, error: profileError } = await this.postgresRest
        .from('profiles')
        .select('id')
        .eq('phone', phone)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (profileError) {
        return new ErrorResponseDto(400, 'Failed to fetch profile ID for security questions', profileError);
      }

      if (!profile || !profile.id) {
        return new ErrorResponseDto(404, 'Profile not found for provided phone number');
      }
      const { data, error } = await this.postgresRest
        .from('security_questions')
        .select()
        .eq('profile_id', profile.id)
        .maybeSingle();
      if (error) {
        return new ErrorResponseDto(400, 'Error fetching security questions', error);
      }
      // this.logger.debug(`Record created: ${JSON.stringify(data)}`);
      this.logger.debug(`Security questions: ${JSON.stringify(data)}`);
      return data as object;
    }
    catch (e) {
      this.logger.error(`Error in getSecurityQuestions: ${e}`);
      // throw new Error(
      //   error instanceof Error
      //     ? error.message
      //     : 'An unexpected error occurred while searching profiles',
      // );
      return new ErrorResponseDto(
        500,
        'An unexpected error occurred while getting security questions',
        e,
      );
    }
  }

  async getProfilesLike(id: string): Promise<Profile[] | ErrorResponseDto> {
    try {
      // Convert to lowercase for case-insensitive searc
      const searchTerm = id.toLowerCase();
      this.logger.log('getProfilesLike searchTerm', searchTerm);

      const { data, error } = await this.postgresRest
        .from('profiles')
        .select('*')
        // Cast UUID to text for pattern matching
        .ilike('id_text', `%${searchTerm}%`)
        .order('created_at', { ascending: false })
        .maybeSingle();

      if (error) {
        throw new Error(`Failed to fetch profiles: ${error.message}`);
      }
      /*
      if (data && data.length > 0) {
        this.logger.log('profile data', data);
        // this.logger.log('profile data id', data['id']);
        const id = data['id'];
        const { data: walletData, error: WalletError } = await this.postgresRest
          .from('wallets')
          .select('id')
          // Cast UUID to text for pattern matching
          .eq('profile_id', id)
          .eq('is_group_wallet', false)
          .maybeSingle();
        this.logger.log('wallet_id', walletData);
        // profileData['wallet_id'] = walletData!['id'];
      }
      */
      this.logger.log('profile data load', data);

      // return data?.length ? (data as Profile[]) : [];
      return data as Profile[];
    } catch (error) {
      this.logger.error(`Error in getProfilesLike: ${error}`);
      // throw new Error(
      //   error instanceof Error
      //     ? error.message
      //     : 'An unexpected error occurred while searching profiles',
      // );
      return new ErrorResponseDto(
        500,
        'An unexpected error occurred while searching profiles',
        error,
      );
    }
  }

  async getProfilesLikeWalletID(id: string): Promise<Profile[]> {
    try {
      // Convert to lowercase for case-insensitive searc
      const searchTerm = id.toLowerCase();
      this.logger.log('searchTerm', searchTerm);
      const { data, error } = await this.postgresRest
        .from('wallets')
        .select('*')
        // Cast UUID to text for pattern matching
        .ilike('profile_id', `%${searchTerm}%`)
        .order('created_at', { ascending: false });

      if (error) {
        throw new Error(`Failed to fetch profiles: ${error.message}`);
      }
      this.logger.log('data', data);
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
        is_invited: profile.is_invited,
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
    this.logger.log('updateFCM', profile);

    const now = new Date().toISOString();
    const { error: profileError, data: profileData } = await this.postgresRest
      .from('profiles')
      .update({
        push_token: profile.push_token,
        updated_at: now,
      })
      .eq('id', profile.id);

    if (profileError) {
      this.logger.log('updateFCM profileError', profileError);

      return {
        status: 'account not updated',
        message: 'account updated failed',
        error: profileError,
        data: null,
      };
    }
    this.logger.log('updateFCM profileData', profileData);

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
}
