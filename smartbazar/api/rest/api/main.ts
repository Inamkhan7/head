import fs from 'fs';
import { join } from 'path';
import { ValidationPipe } from '@nestjs/common';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from '../src/app.module';
import { AllExceptionsFilter } from '../utils/all-exceptions.filter';

let server;

async function createApp() {
  const app = await NestFactory.create(AppModule, { cors: true });
  const stylePath = join(__dirname, '..', 'swagger-ui.css');
  const customCss = fs.readFileSync(stylePath, 'utf-8');
  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(new AllExceptionsFilter(httpAdapter));
  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe({ forbidUnknownValues: false }));
  const config = new DocumentBuilder().build();
  const document = SwaggerModule.createDocument(app, config);
  const options = {
    customCss,
  };
  SwaggerModule.setup('docs', app, document, options);

  await app.init();
  return app.getHttpAdapter().getInstance();
}

export default async function handler(req, res) {
  server = server ?? (await createApp());
  return server(req, res);
}
