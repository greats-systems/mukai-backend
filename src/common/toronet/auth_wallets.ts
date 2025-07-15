import axios from 'axios';

export class ToroGateway {
  private readonly baseUrl: string;
  private readonly apiKey: string;

  constructor(baseUrl: string, apiKey: string) {
    this.baseUrl =
      process.env.ENV === 'production'
        ? process.env.TORONET_MAINNET_API_URL || 'http://toronet.org'
        : process.env.TORONET_TESTNET_API_URL || 'http://testnet.toronet.org';
    this.apiKey =
      process.env.ENV === 'production'
        ? process.env.TORONET_MAINNET_API_KEY || ''
        : process.env.TORONET_TESTNET_API_KEY || '';
  }

  private getHeaders() {
    return {
      Authorization: `Bearer ${this.apiKey}`,
      'Content-Type': 'application/json',
    };
  }

  public async createKey(password: string = 'toronet'): Promise<any> {
    const data = {
      op: 'createkey',
      params: [
        {
          name: 'pwd',
          value: password,
        },
      ],
    };

    const url = `${this.baseUrl}/api/keystore`;

    try {
      const response = await axios.post(url, data, {
        headers: this.getHeaders(),
        maxBodyLength: Infinity,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  public async getKey(address: string): Promise<any> {
    const data = {
      op: 'getkey',
      params: [
        {
          name: 'addr',
          value: address,
        },
      ],
    };

    const url = `${this.baseUrl}/api/keystore`;

    try {
      const response = await axios.post(url, data, {
        headers: this.getHeaders(),
        maxBodyLength: Infinity,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  public async updateKeyPassword(
    address: string,
    oldPassword: string,
    newPassword: string,
  ): Promise<any> {
    const data = {
      op: 'updatekeypwd',
      params: [
        {
          name: 'addr',
          value: address,
        },
        {
          name: 'oldpwd',
          value: oldPassword,
        },
        {
          name: 'newpwd',
          value: newPassword,
        },
      ],
    };

    const url = `${this.baseUrl}/api/keystore`;

    try {
      const response = await axios.post(url, data, {
        headers: this.getHeaders(),
        maxBodyLength: Infinity,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  public async deleteKey(
    address: string,
    password: string = 'toronet',
  ): Promise<any> {
    const data = {
      op: 'deletekey',
      params: [
        {
          name: 'addr',
          value: address,
        },
        {
          name: 'pwd',
          value: password,
        },
      ],
    };

    const url = `${this.baseUrl}/api/keystore`;

    try {
      const response = await axios.post(url, data, {
        headers: this.getHeaders(),
        maxBodyLength: Infinity,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  public async getBalance(address: string): Promise<any> {
    const data = {
      op: 'getbalance',
      params: [
        {
          name: 'address',
          value: address,
        },
      ],
    };

    const url = `${this.baseUrl}/api/wallet`;

    try {
      const response = await axios.post(url, data, {
        headers: this.getHeaders(),
        maxBodyLength: Infinity,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}
