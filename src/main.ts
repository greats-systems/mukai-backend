import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder, SwaggerDocumentOptions } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
    .setTitle('Commodity Distribution Network')
    .setDescription('Activity and Nodes API Documentation')
    .setVersion('1.0')
    .addTag('simplyledgers')
    .build();

  const options: SwaggerDocumentOptions = {
    operationIdFactory: (
      controllerKey: string,
      methodKey: string
    ) => methodKey
  };
  const documentFactory = () => SwaggerModule.createDocument(app, config, options);
  SwaggerModule.setup('api/docs', app, documentFactory);

  await app.listen(process.env.PORT ?? 3000, '0.0.0.0', () => {
    console.log('server connected');
  });
}
bootstrap();
