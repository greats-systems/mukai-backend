// src/firefly/firefly-ws.service.ts
import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import * as WebSocket from 'ws';
import axios from 'axios';

@Injectable()
export class CoreProduceNetworkWsService implements OnModuleInit, OnModuleDestroy {
    private wsClient: WebSocket;
    private readonly networkSocketUrl = 'ws://localhost:5000/ws';

    private readonly logger = new Logger(CoreProduceNetworkWsService.name);
    private readonly wsSubscriptionConfig = {
        type: 'start',
        name: process.env.FIREFLY_SUB_NAME || 'produce_manager',
        namespace: process.env.FIREFLY_NAMESPACE || 'default',
        autoack: true,
    };

    async onModuleInit() {
        const exists = await this.checkSubscriptionExists('produce_manager');
        if (exists) {
            this.connect();
            this.logger.log('✅ Verified subscription exists via Network REST API');
        } else {
            this.logger.error('❌ Subscription not found in Network');
        }
    }

    private connect() {
        this.wsClient = new WebSocket(this.networkSocketUrl);

        this.wsClient.on('open', () => {
            this.logger.log('✅ Connected to network socket');
            this.subscribeToProduceManager();
        });

        this.wsClient.on('message', (data) => {
            try {
                const parsed = JSON.parse(data.toString());
                this.logger.debug('Received message:', parsed);

                this.handleMessage(parsed);
            } catch (err) {
                this.logger.error('Failed to parse message', err);
            }
        });

        this.wsClient.on('close', () => {
            this.logger.warn('network WebSocket disconnected. Reconnecting...');
            setTimeout(() => this.connect(), 5000);
        });

        this.wsClient.on('error', (err) => {
            this.logger.error('WebSocket error', err);
        });
    }

    private subscribeToProduceManager() {
        const subscriptionMessage = {
            type: 'start',
            name: 'produce_manager',
            namespace: 'default',
            autoack: true,
        };
        try {
            this.wsClient.send(JSON.stringify(subscriptionMessage));
            this.logger.log('✅ Subscribed produce manager contract');
        } catch (error) {
            this.logger.error('❌ Failed to Subscribe produce manager contract', error);

        }


    }
    async checkSubscriptionExists(name: string) {
        const res = await axios.get(`http://localhost:5000/api/v1/subscriptions?name=${name}`);
        return res.data.length > 0;
    }
    private handleMessage(message: any) {
        // Handle network WS messages here
        this.logger.log(`Event: ${JSON.stringify(message)}`);
        // You can emit events to other services/modules
    }

    onModuleDestroy() {
        this.wsClient?.close();
    }


}
