import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { SupabaseAuthStrategy } from 'nestjs-supabase-auth'

@Injectable()
export class SupabaseStrategy extends PassportStrategy(
    SupabaseAuthStrategy,
    'supabase', Strategy
) {
    public constructor() {
        // Validate that required environment variables are set
        const supabaseUrl = process.env.ENV == 'local' ? process.env.LOCAL_SUPABASE_URL : process.env.SUPABASE_URL
        const supabaseKey = process.env.ENV == 'local' ? process.env.LOCAL_SUPABASE_KEY : process.env.SUPABASE_KEY
        // const supabaseJwtSecret = process.env.SUPABASE_JWT_SECRET

        if (!supabaseUrl || !supabaseKey) {
            throw new Error(
                'Missing required Supabase environment variables (SUPABASE_URL, SUPABASE_KEY, SUPABASE_JWT_SECRET)'
            )
        }

        super({
            supabaseUrl,
            supabaseKey,
            // supabaseJwtSecret,
            supabaseOptions: {},
            extractor: ExtractJwt.fromAuthHeaderAsBearerToken(),
        })
    }

    async validate(payload: any): Promise<any> {
        return payload
    }

    authenticate(req) {
        super.authenticate(req)
    }
}