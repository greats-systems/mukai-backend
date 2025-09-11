import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
// import { ValidationPipe } from '@nestjs/common';
import {
  SwaggerModule,
  DocumentBuilder,
  SwaggerDocumentOptions,
  SwaggerCustomOptions,
} from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  const config = new DocumentBuilder()
    .addBasicAuth()
    .setTitle('Mukai API Docs')
    .setDescription(
      'Mukai Savings and Credit Co-operatives Management API Documentation',
    )
    .setVersion('1.0')
    .build();

  const options: SwaggerDocumentOptions = {
    operationIdFactory: (controllerKey: string, methodKey: string) => methodKey,
  };

  const document = SwaggerModule.createDocument(app, config, options);

  // Custom Swagger UI configuration for alphabetical sorting
  const customOptions: SwaggerCustomOptions = {
    swaggerOptions: {
      docExpansion: 'none',
      filter: true,
      showRequestDuration: true,
      operationsSorter: 'alpha', // Sort operations alphabetically
      tagsSorter: 'alpha', // Sort tags alphabetically
    },
    customSiteTitle: 'Mukai API Documentation',
  };

  SwaggerModule.setup('docs/api', app, document, customOptions);

  // app.useGlobalPipes(
  //   new ValidationPipe({
  //     whitelist: true, // remove non-whitelisted properties
  //     forbidNonWhitelisted: true, // throw errors for non-whitelisted properties
  //     transform: true, // automatically transform payloads to DTO instances
  //   }),
  // );

  await app.listen(process.env.PORT ?? 3001, '0.0.0.0', () => {
    console.log('server connected');
  });
}
void bootstrap();
