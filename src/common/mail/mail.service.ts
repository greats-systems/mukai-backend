/* eslint-disable @typescript-eslint/restrict-template-expressions */
import { Injectable, Logger } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

export interface SendMailOptions {
  to: string | string[];
  subject: string;
  template?: string | undefined;
  context?: Record<string, any>;
  text?: string;
  html?: string;
  attachments?: Array<{
    filename: string;
    content?: any;
    contentType?: string;
    path?: null;
  }>;
  cc?: string | string[];
  bcc?: string | string[];
}

export interface WelcomeEmailData {
  name: string;
  verificationLink?: string;
}

export interface PasswordResetData {
  name: string;
  resetLink: string;
  expiresIn?: string;
}

export interface NotificationData {
  title: string;
  message: string;
  actionLink?: string;
  actionText?: string;
}

export interface OtpEmailData {
  name?: string;
  otp: string;
  purpose?: string;
  validity?: number;
}

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);

  constructor(private readonly mailerService: MailerService) {}

  async sendOtpEmail(email: string, data: OtpEmailData): Promise<boolean> {
    const purpose = data.purpose || 'account verification';
    const validity = data.validity || 10; // default 10 minutes

    try {
      return await this.sendMail({
        to: email,
        subject: `Your Verification Code - ${data.otp}`,
        template: './otp-verification', // or './otp-simple'
        context: {
          name: data.name,
          otp: data.otp,
          purpose: purpose,
          validity: validity,
          year: new Date().getFullYear(),
        },
      });
    } catch (error) {
      this.logger.error(`Failed to send OTP email: ${error}`);
      return false;
    }
  }

  async sendMail(options: SendMailOptions): Promise<boolean> {
    try {
      await this.mailerService.sendMail({
        to: options.to,
        subject: options.subject,
        template: options.template,
        context: options.context,
        text: options.text,
        html: options.html,
        // attachments: options.attachments,
        cc: options.cc,
        bcc: options.bcc,
      });

      this.logger.log(`Email sent successfully to: ${options.to}`);
      return true;
    } catch (error) {
      this.logger.error(`Failed to send email: ${error}`);
      return false;
    }
  }

  async sendWelcomeEmail(
    email: string,
    data: WelcomeEmailData,
  ): Promise<boolean> {
    return this.sendMail({
      to: email,
      subject: 'Welcome to Our Platform!',
      template: './welcome',
      context: {
        name: data.name,
        verificationLink: data.verificationLink,
        year: new Date().getFullYear(),
      },
    });
  }

  async sendPasswordResetEmail(
    email: string,
    data: PasswordResetData,
  ): Promise<boolean> {
    return this.sendMail({
      to: email,
      subject: 'Password Reset Request',
      template: './password-reset',
      context: {
        name: data.name,
        resetLink: data.resetLink,
        expiresIn: data.expiresIn || '24 hours',
        year: new Date().getFullYear(),
      },
    });
  }

  async sendNotificationEmail(
    email: string,
    data: NotificationData,
  ): Promise<boolean> {
    return this.sendMail({
      to: email,
      subject: data.title,
      template: './notification',
      context: {
        title: data.title,
        message: data.message,
        actionLink: data.actionLink,
        actionText: data.actionText || 'View Details',
        year: new Date().getFullYear(),
      },
    });
  }

  async sendVerificationEmail(
    email: string,
    verificationLink: string,
    name: string,
  ): Promise<boolean> {
    return this.sendMail({
      to: email,
      subject: 'Verify Your Email Address',
      template: './verification',
      context: {
        name,
        verificationLink,
        year: new Date().getFullYear(),
      },
    });
  }

  async sendPlainTextEmail(
    to: string,
    subject: string,
    text: string,
  ): Promise<boolean> {
    return this.sendMail({
      to,
      subject,
      text,
    });
  }

  async sendHtmlEmail(
    to: string,
    subject: string,
    html: string,
  ): Promise<boolean> {
    return this.sendMail({
      to,
      subject,
      html,
    });
  }
}
