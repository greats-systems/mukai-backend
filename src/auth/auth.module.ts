import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtAuthGuard } from './guards/jwt.auth.guard';
import { SupabaseStrategy } from './strategies/supabase.strategy';
import { PostgresRest } from 'src/common/postgresrest';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { SmileWalletService } from 'src/wallet/services/zb_digital_wallet.service';
import { ToroGateway } from 'src/common/toronet/auth_wallets';
import { MailModule } from 'src/common/mail/mail.module';
import { JwtNotBannedGuard } from './guards/jwt.not-banned.guard';
import { WalletModule } from 'src/mukai/modules/wallet.module';

@Module({
  imports: [
    MailModule,
    WalletModule,
    PassportModule,
    ConfigModule,
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => {
        return {
          global: true,
          secret: configService.get<string>('JWT_SECRET'),
          signOptions: { expiresIn: 40000 },
        };
      },
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],

  providers: [
    JwtAuthGuard,
    SupabaseStrategy,
    PostgresRest,
    AuthService,
    {
      provide: JwtNotBannedGuard,
      useFactory: (authService: AuthService) => {
        return new JwtNotBannedGuard(authService);
      },
      inject: [AuthService],
    },
    SmileWalletService,
    ToroGateway,
  ],
  exports: [JwtAuthGuard, JwtModule, JwtNotBannedGuard],
})
export class AuthModule {}
