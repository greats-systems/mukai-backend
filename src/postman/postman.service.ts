// src/postman/postman.service.ts
import { Injectable } from '@nestjs/common';
import { writeFileSync, existsSync, mkdirSync, readFileSync } from 'fs';
import { join } from 'path';
import { convert } from 'api-spec-converter';

@Injectable()
export class PostmanService {
  private readonly exportsDir = join(process.cwd(), 'exports');
  private readonly collectionPath = join(this.exportsDir, 'mukai-api-postman-collection.json');

  async generatePostmanCollection(openApiDocument: any): Promise<boolean> {
    try {
      // Ensure exports directory exists
      if (!existsSync(this.exportsDir)) {
        mkdirSync(this.exportsDir, { recursive: true });
      }

      // Convert OpenAPI to Postman collection
      const result = await convert({
        from: 'openapi_3',
        to: 'postman',
        source: openApiDocument,
      });

      // Save Postman collection
      writeFileSync(this.collectionPath, JSON.stringify(result.spec, null, 2));
      console.log('Postman collection generated successfully:', this.collectionPath);
      return true;
    } catch (error) {
      console.error('Error generating Postman collection:', error);
      return false;
    }
  }

  getPostmanCollection(): string {
    try {
      return readFileSync(this.collectionPath, 'utf8');
    } catch (error) {
      throw new Error('Postman collection not found. Please ensure it has been generated.');
    }
  }

  collectionExists(): boolean {
    return existsSync(this.collectionPath);
  }
}