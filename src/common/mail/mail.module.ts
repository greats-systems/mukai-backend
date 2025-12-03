/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { join } from 'path';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { existsSync } from 'fs';

@Module({
  imports: [
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        console.log('🔧 Initializing Mailer Module...');

        // Check if template directory exists
        const sourceDir = join(
          process.cwd(),
          'src',
          'common',
          'mail',
          'templates',
        );
        const distDir = join(
          process.cwd(),
          'dist',
          'src',
          'common',
          'mail',
          'templates',
        );

        let templateConfig: any = undefined;

        // Check if template directory exists
        if (existsSync(sourceDir) || existsSync(distDir)) {
          const templateDir = existsSync(sourceDir) ? sourceDir : distDir;
          console.log(`📁 Using template directory: ${templateDir}`);

          templateConfig = {
            dir: templateDir,
            adapter: new HandlebarsAdapter(),
            options: { strict: true },
          };
        } else {
          console.log('⚠️  Template directory not found. Templates disabled.');
        }

        // Get configuration values with defaults
        const mailConfig = {
          transport: {
            host: configService.get('MAIL_HOST') || 'smtp.gmail.com',
            port: configService.get<number>('MAIL_PORT') || 587,
            secure: configService.get('MAIL_SECURE') === 'true',
            auth: {
              user: configService.get('MAIL_USER') || 'test@example.com',
              pass: configService.get('MAIL_PASSWORD') || 'test123',
            },
            connectionTimeout: 10000,
            // Add debugging
            debug: process.env.NODE_ENV === 'development',
            logger: process.env.NODE_ENV === 'development',
          },
          defaults: {
            from: `"${configService.get('MAIL_FROM_NAME') || 'Test App'}" <${configService.get('MAIL_FROM_EMAIL') || 'noreply@test.com'}>`,
          },
        };

        // Add template config if available
        if (templateConfig) {
          Object.assign(mailConfig, { template: templateConfig });
        }

        console.log('✅ Mailer configuration complete');
        console.log(`📧 From: ${mailConfig.defaults.from}`);
        console.log(
          `🏠 Host: ${mailConfig.transport.host}:${mailConfig.transport.port}`,
        );

        return mailConfig;
      },
      inject: [ConfigService],
    }),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
