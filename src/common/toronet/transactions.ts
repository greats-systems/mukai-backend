import axios from 'axios';


export class ToroGateway {
    private readonly baseUrl: string;
    private readonly apiKey: string;

    constructor(baseUrl: string, apiKey: string) {
        this.baseUrl = process.env.ENV === 'production' ? process.env.TORONET_MAINNET_API_URL || 'http://toronet.org' : process.env.TORONET_TESTNET_API_URL || 'http://testnet.toronet.org';
        this.apiKey = process.env.ENV === 'production' ? process.env.TORONET_MAINNET_API_KEY || '' : process.env.TORONET_TESTNET_API_KEY || '';
    }

    private getHeaders() {
        return {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
        };
    }

    public async getBalance(address: string): Promise<any> {
        const data = {
            op: 'getbalance',
            params: [
                {
                    name: 'address',
                    value: address
                }
            ]
        };

        const url = `${this.baseUrl}/api/wallet`;

        try {
            const response = await axios.post(url, data, {
                headers: this.getHeaders(),
                maxBodyLength: Infinity
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    }
}
