import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
// import { ValidationPipe } from '@nestjs/common';
import {
  SwaggerModule,
  DocumentBuilder,
  SwaggerDocumentOptions,
} from '@nestjs/swagger';
import { JwtAuthGuard } from './auth/guards/jwt.auth.guard';
import { Reflector } from '@nestjs/core';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Protect Swagger docs with JWT
  const reflector = app.get(Reflector);
  app.use('/docs/api', async (req, res, next) => {
    // Create a context for the guard
    const context = {
      switchToHttp: () => ({ getRequest: () => req, getResponse: () => res }),
      getHandler: () => null,
      getClass: () => null,
    };
    const guard = new JwtAuthGuard(reflector);
    const canActivate = await guard.canActivate(context as any);
    if (canActivate) {
      next();
    } else {
      res.status(401).json({ message: 'Unauthorized' });
    }
  });
  const config = new DocumentBuilder()
    .setTitle('Mukai API Docs')
    .setDescription(
      'Mukai Savings and Credit Co-operatives Management API Documentation',
    )
    .setVersion('1.0')
    .addTag('Controllers REST API v2')
    .build();

  const options: SwaggerDocumentOptions = {
    operationIdFactory: (controllerKey: string, methodKey: string) => methodKey,
  };
  const documentFactory = () =>
    SwaggerModule.createDocument(app, config, options);
  SwaggerModule.setup('docs/api', app, documentFactory);
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
