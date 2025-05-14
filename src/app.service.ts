import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  getObject(): Object {
    return {
      key1: 'object1',
      key2: 'object2',
    };
  }
}
