/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt } from 'passport-jwt';
import { SupabaseAuthStrategy } from 'nestjs-supabase-auth';

@Injectable()
export class SupabaseStrategy extends PassportStrategy(
  SupabaseAuthStrategy,
  'supabase',
  // Strategy,
) {
  public constructor() {
    // Validate that required environment variables are set
    const supabaseUrl =
      process.env.ENV == 'local'
        ? process.env.LOCAL_SUPABASE_URL
        : process.env.SUPABASE_URL;
    const supabaseKey =
      process.env.ENV == 'local'
        ? process.env.LOCAL_SUPABASE_KEY
        : process.env.SUPABASE_SERVICE_ROLE_KEY;
    // const supabaseJwtSecret = process.env.SUPABASE_JWT_SECRET;
    if (!supabaseUrl || !supabaseKey) {
      throw new Error(
        'Missing required Supabase environment variables (SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, SUPABASE_JWT_SECRET)',
      );
    }

    super({
      supabaseUrl,
      supabaseKey,
      supabaseOptions: {},
      extractor: ExtractJwt.fromAuthHeaderAsBearerToken(),
      // secretOrKey: supabaseJwtSecret,
    });
  }

  validate(payload: any): any {
    return payload;
  }

  authenticate(req) {
    super.authenticate(req);
  }
}
