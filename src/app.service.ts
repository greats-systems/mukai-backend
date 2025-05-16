import { Injectable } from '@nestjs/common';
import * as LedgerService from './ledger/ledger.service';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  getObject(): object {
    return {
      key1: 'object1',
      key2: 'object2',
    };
  }

  getCommodity(): object {
    return LedgerService.CommodityService;
  }
}
