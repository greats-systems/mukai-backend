/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { PostgresRest } from 'src/common/postgresrest';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private postgresRest: PostgresRest,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  async validate(payload: any) {
    // Verify user still exists in database
    const { data: user, error } = await this.postgresRest
      .from('users')
      .select('id, email, name')
      .eq('id', payload.sub)
      .single();

    if (error || !user) {
      throw new Error('User not found');
    }

    return {
      userId: user.id,
      email: user.email,
      name: user.name,
    };
  }
}
