// src/postman/postman.controller.ts
import { Controller, Get, Res, Header, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { PostmanService } from './postman.service';

@Controller('docs')
export class PostmanController {
  constructor(private readonly postmanService: PostmanService) {}

  @Get('postman')
  @Header('Content-Type', 'application/json')
  @Header('Content-Disposition', 'attachment; filename="mukai-api-postman-collection.json"')
  getPostmanCollection(@Res() res: Response) {
    try {
      const collection = this.postmanService.getPostmanCollection();
      res.send(JSON.parse(collection));
    } catch (error) {
      res.status(HttpStatus.NOT_FOUND).json({
        message: error.message,
        error: 'Not Found',
        statusCode: HttpStatus.NOT_FOUND,
      });
    }
  }

  @Get('json')
  getPostmanCollectionJson(@Res() res: Response) {
    try {
      const collection = this.postmanService.getPostmanCollection();
      res.json(JSON.parse(collection));
    } catch (error) {
      res.status(HttpStatus.NOT_FOUND).json({
        message: error.message,
        error: 'Not Found',
        statusCode: HttpStatus.NOT_FOUND,
      });
    }
  }

  @Get('postman/status')
  getPostmanCollectionStatus() {
    return {
      generated: this.postmanService.collectionExists(),
      message: this.postmanService.collectionExists() 
        ? 'Postman collection is available' 
        : 'Postman collection not generated yet'
    };
  }
}