import { Inject, Injectable, Logger, Scope } from '@nestjs/common';
import { Request } from 'express';
import { REQUEST } from '@nestjs/core';
import { PostgrestClient } from '@supabase/postgrest-js';
import { ConfigService } from '@nestjs/config';

@Injectable({ scope: Scope.REQUEST })
export class PostgresRest {
    private readonly logger = new Logger(PostgresRest.name);
    private clientInstance: PostgrestClient;

    constructor(
        @Inject(REQUEST) private readonly request: Request,
        private readonly configService: ConfigService) {
        this.initializeClient();
        return new Proxy(this, {
            get: (target, prop: keyof PostgrestClient, receiver) => {
                if (prop in target) {
                    return Reflect.get(target, prop, receiver);
                }
                if (this.clientInstance && prop in this.clientInstance) {
                    const value = this.clientInstance[prop];
                    return typeof value === 'function'
                        ? value.bind(this.clientInstance)
                        : value;
                }
                return Reflect.get(target, prop, receiver);
            }
        });
    }

    private initializeClient() {
        this.logger.log('Initializing PostgresRest client...');

        const DB_REST_URL = this.configService.get<string>('DB_REST_URL');

        if (!DB_REST_URL) {
            throw new Error('DB_REST_URL configuration is not defined');
        }
        this.clientInstance = new PostgrestClient(DB_REST_URL);
        this.logger.log('PostgresRest client initialized');
    }

    public from(tableName: string) {
        return this.clientInstance.from(tableName);
    }

    public rpc(fnName: string, params?: object) {
        return this.clientInstance.rpc(fnName, params);
    }
}