// src/postman/postman.module.ts
import { Module } from '@nestjs/common';
import { PostmanService } from './postman.service';
import { PostmanController } from './postman.controller';

@Module({
  providers: [PostmanService],
  controllers: [PostmanController],
  exports: [PostmanService],
})
export class PostmanModule {}
