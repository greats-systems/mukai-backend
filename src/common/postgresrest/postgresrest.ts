/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Inject, Injectable, Logger, Scope } from '@nestjs/common';
import { Request } from 'express';
import { REQUEST } from '@nestjs/core';
import { PostgrestClient } from '@supabase/postgrest-js';
import { ConfigService } from '@nestjs/config';

@Injectable({ scope: Scope.REQUEST })
export class PostgresRest {
  private readonly logger = new Logger(PostgresRest.name);
  private clientInstance: PostgrestClient;
  private authClientInstance: PostgrestClient;

  constructor(
    @Inject(REQUEST) private readonly request: Request,
    private readonly configService: ConfigService,
  ) {
    this.initializeClient();
    return new Proxy(this, {
      get: (target, prop: keyof PostgrestClient, receiver) => {
        if (prop in target) {
          return Reflect.get(target, prop, receiver);
        }
        if (this.clientInstance && prop in this.clientInstance) {
          const value = this.clientInstance[prop];
          // const authClientInstanceValue = this.authClientInstance[prop];
          return typeof value === 'function'
            ? value.bind(this.clientInstance)
            : value;
        }
        return Reflect.get(target, prop, receiver);
      },
    });
  }

  private initializeClient() {
    this.logger.log('Initializing PostgresRest client...');
    const DB_REST_URL =
      this.configService.get<string>('ENV') == 'local'
        ? this.configService.get<string>('LOCAL_DB_REST_URL')
        : this.configService.get<string>('PROD_DB_REST_URL');
    const SERVICE_ROLE_KEY =
      this.configService.get<string>('ENV') == 'local'
        ? this.configService.get<string>('LOCAL_SERVICE_ROLE_KEY')
        : this.configService.get<string>('SUPABASE_SERVICE_ROLE_KEY');

    if (!DB_REST_URL) {
      throw new Error('DB_REST_URL configuration is not defined');
    }
    this.clientInstance = new PostgrestClient(DB_REST_URL, {
      headers: {
        apikey: SERVICE_ROLE_KEY as string, // Required for all requests
        Authorization: `Bearer ${SERVICE_ROLE_KEY as string}`,
        'Accept-Profile': 'public', // Allow both schemas
        'Content-Profile': 'public', // Default to auth for writes
      },
    });
    this.authClientInstance = new PostgrestClient(DB_REST_URL, {
      headers: {
        apikey: SERVICE_ROLE_KEY as string, // Required for all requests
        Authorization: `Bearer ${SERVICE_ROLE_KEY as string}`,
        'Accept-Profile': 'auth', // Allow both schemas
        'Content-Profile': 'auth', // Default to auth for writes
      },
    });
    this.logger.log('PostgresRest client initialized');
  }

  public from(tableName: string) {
    return this.clientInstance.from(tableName);
  }
  public auth_client(tableName: string) {
    return this.authClientInstance.from(tableName);
  }

  public rpc(fnName: string, params?: object) {
    return this.clientInstance.rpc(fnName, params);
  }

  public async clearCache() {
    try {
      await this.clientInstance.rpc('pg_notify', {
        channel: 'postgrest',
        payload: 'reload schema',
      });
      this.logger.log('PostgREST schema cache cleared');
    } catch (error) {
      this.logger.error('Failed to clear PostgREST cache:', error);
    }
  }
}
