import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class ToroNetService {

    constructor() { }

    async createWallet(wallet_user_id: string): Promise<any> {
        let data = JSON.stringify({
            "op": "createkey",
            "params": [
                {
                    "name": wallet_user_id,
                    "value": "toronet"
                }
            ]
        });

        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: 'http://testnet.toronet.org/api/keystore',
            headers: {
                'Content-Type': 'application/json'
            },
            data: data
        };

        axios.request(config)
            .then((response) => {
                console.log(JSON.stringify(response.data));
                return response.data;
            })
            .catch((error) => {
                console.log(error);
                return error;
            });


    }

    // get wallet balance
    async getWalletBalance(wallet_address: string): Promise<any> {
        const axios = require('axios');
        let data = JSON.stringify({
            "op": "getbalance",
            "params": [
                {
                    "name": "addr",
                    "value": wallet_address
                }
            ]
        });

        let config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: 'http://testnet.toronet.org/api/currency/dollar/',
            headers: {
                'Content-Type': 'application/json'
            },
            data: data
        };

        axios.request(config)
            .then((response) => {
                console.log(JSON.stringify(response.data));

                return response.data;
            })
            .catch((error) => {
                console.log(error);
                return error;
            });

    }
}