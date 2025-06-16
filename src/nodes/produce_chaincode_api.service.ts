import { Injectable, Logger } from '@nestjs/common';
import { from } from 'rxjs';
import { ConfigService } from '@nestjs/config';
import {
  ProduceInput,
  TransferProduceInput,
  ProduceResponse,
  OperationResponse,
  CreateListenerDto,
  ListenerResponse
} from './dto/produce.dto';
import { AxiosResponse } from 'axios';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import axios from 'axios';
function initLogger(funcname: Function): Logger {
  return new Logger(funcname.name);
}

@Injectable()
export class ProduceChainCodeService {
  private baseUrl: string;
  private readonly logger = initLogger(ProduceChainCodeService);

  constructor(
    private configService: ConfigService
  ) {
    this.baseUrl = this.configService.get<string>('FIREFLY_API_URL') ||
      'http://127.0.0.1:5001/api/v1/namespaces/default/apis/produce_manager_v_1_0';
  }

  // Interface operations
  async getInterface(headers?: any): Promise<Observable<AxiosResponse<any>>> {
    return await axios.get(`${this.baseUrl}/interface`, { headers });
  }

  // Produce CRUD operations
  async createProduce(
    input: ProduceInput,
    idempotencyKey?: string,
    key?: string,
    options?: any,
    confirm?: string,
    headers?: any
  ) {

    const body = {
      input,
    };
    this.logger.log('Produce Chaincode body', body);

    const params = confirm ? { confirm } : {};
    try {
      let res = await axios.post(
        `${this.baseUrl}/invoke/CreateProduce`,
        body,
        { headers, params }
      );
      this.logger.log('Produce Chaincode res', res);
      return res;
    } catch (error) {
      this.logger.error('Produce Chaincode error', error);
      return error
    }

  }

  async readProduce(
    id: string,
    idempotencyKey?: string,
    key?: string,
    options?: any,
    confirm?: string,
    headers?: any
  ): Promise<Observable<AxiosResponse<OperationResponse>>> {
    const body = {
      idempotencyKey,
      input: { id },
      key,
      options
    };

    const params = confirm ? { confirm } : {};

    return await axios.post(
      `${this.baseUrl}/invoke/ReadProduce`,
      body,
      { headers, params }
    );
  }

  async updateProduce(
    input: ProduceInput,
    idempotencyKey?: string,
    key?: string,
    options?: any,
    confirm?: string,
    headers?: any
  ): Promise<Observable<AxiosResponse<OperationResponse>>> {
    const body = {
      idempotencyKey,
      input,
      key,
      options
    };

    const params = confirm ? { confirm } : {};

    return await axios.post(
      `${this.baseUrl}/invoke/UpdateProduce`,
      body,
      { headers, params }
    );
  }

  async deleteProduce(
    id: string,
    idempotencyKey?: string,
    key?: string,
    options?: any,
    confirm?: string,
    headers?: any
  ): Promise<Observable<AxiosResponse<OperationResponse>>> {
    const body = {
      idempotencyKey,
      input: { id },
      key,
      options
    };

    const params = confirm ? { confirm } : {};

    return await axios.post(
      `${this.baseUrl}/invoke/DeleteProduce`,
      body,
      { headers, params }
    );
  }

  async transferProduce(
    input: TransferProduceInput,
    idempotencyKey?: string,
    key?: string,
    options?: any,
    confirm?: string,
    headers?: any
  ): Promise<Observable<AxiosResponse<OperationResponse>>> {
    const body = {
      idempotencyKey,
      input,
      key,
      options
    };

    const params = confirm ? { confirm } : {};

    return await axios.post(
      `${this.baseUrl}/invoke/TransferProduce`,
      body,
      { headers, params }
    );
  }

  // Query operations (read-only)
  async queryCreateProduce(
    input: ProduceInput,
    idempotencyKey?: string,
    key?: string,
    options?: any,
    headers?: any
  ): Promise<Observable<AxiosResponse<any>>> {
    const body = {
      idempotencyKey,
      input,
      key,
      options
    };

    return await axios.post(
      `${this.baseUrl}/query/CreateProduce`,
      body,
      { headers }
    );
  }

  async queryReadProduce(
    id: string,
    idempotencyKey?: string,
    key?: string,
    options?: any,
    headers?: any
  ): Promise<Observable<AxiosResponse<ProduceResponse>>> {
    const body = {
      idempotencyKey,
      input: { id },
      key,
      options
    };

    return from(axios.post(
      `${this.baseUrl}/query/TransferProduce`,
      body,
      { headers }
    )).pipe(
      map(response => ({
        ...response,
        data: (response.data as any)?.output
      }))
    );
  }

  async queryUpdateProduce(
    input: ProduceInput,
    idempotencyKey?: string,
    key?: string,
    options?: any,
    headers?: any
  ): Promise<Observable<AxiosResponse<any>>> {
    const body = {
      idempotencyKey,
      input,
      key,
      options
    };

    return await axios.post(
      `${this.baseUrl}/query/UpdateProduce`,
      body,
      { headers }
    );
  }

  async queryDeleteProduce(
    id: string,
    idempotencyKey?: string,
    key?: string,
    options?: any,
    headers?: any
  ): Promise<Observable<AxiosResponse<any>>> {
    const body = {
      idempotencyKey,
      input: { id },
      key,
      options
    };

    return await axios.post(
      `${this.baseUrl}/query/DeleteProduce`,
      body,
      { headers }
    );
  }

  async queryTransferProduce(
    input: TransferProduceInput,
    idempotencyKey?: string,
    key?: string,
    options?: any,
    headers?: any
  ): Promise<Observable<AxiosResponse<{ oldOwner: string; }>>> {
    const body = {
      idempotencyKey,
      input,
      key,
      options
    };

    return from(axios.post(
      `${this.baseUrl}/query/TransferProduce`,
      body,
      { headers }
    )).pipe(
      map(response => ({
        ...response,
        data: (response.data as any)?.output
      }))
    );
  }

  // Event listeners
  async getCreateProduceListeners(headers?: any): Promise<Observable<AxiosResponse<ListenerResponse[]>>> {
    return await axios.get(`${this.baseUrl}/listeners/CreateProduce`, { headers });
  }

  async createCreateProduceListener(
    createListenerDto: CreateListenerDto,
    headers?: any
  ): Promise<Observable<AxiosResponse<ListenerResponse>>> {
    return await axios.post(
      `${this.baseUrl}/listeners/CreateProduce`,
      createListenerDto,
      { headers }
    );
  }

  async getUpdateProduceListeners(headers?: any): Promise<Observable<AxiosResponse<ListenerResponse[]>>> {
    return await axios.get(`${this.baseUrl}/listeners/UpdateProduce`, { headers });
  }

  async createUpdateProduceListener(
    createListenerDto: CreateListenerDto,
    headers?: any
  ): Promise<Observable<AxiosResponse<ListenerResponse>>> {
    return await axios.post(
      `${this.baseUrl}/listeners/UpdateProduce`,
      createListenerDto,
      { headers }
    );
  }

  async getDeleteProduceListeners(headers?: any): Promise<Observable<AxiosResponse<ListenerResponse[]>>> {
    return await axios.get(`${this.baseUrl}/listeners/DeleteProduce`, { headers });
  }

  async createDeleteProduceListener(
    createListenerDto: CreateListenerDto,
    headers?: any
  ): Promise<Observable<AxiosResponse<ListenerResponse>>> {
    return await axios.post(
      `${this.baseUrl}/listeners/DeleteProduce`,
      createListenerDto,
      { headers }
    );
  }

  async getTransferProduceListeners(headers?: any): Promise<Observable<AxiosResponse<ListenerResponse[]>>> {
    return await axios.get(`${this.baseUrl}/listeners/TransferProduce`, { headers });
  }

  async createTransferProduceListener(
    createListenerDto: CreateListenerDto,
    headers?: any
  ): Promise<Observable<AxiosResponse<ListenerResponse>>> {
    return await axios.post(
      `${this.baseUrl}/listeners/TransferProduce`,
      createListenerDto,
      { headers }
    );
  }
}