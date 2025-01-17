import fs from 'fs';
import { join } from 'path';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from '../utils/all-exceptions.filter';

export async function createApp(): Promise<INestApplication> {
  const app = await NestFactory.create(AppModule, { cors: true });
  const stylePath = join(__dirname, 'swagger-ui.css');
  let customCss = '';

  try {
    customCss = fs.readFileSync(stylePath, 'utf-8');
  } catch {}

  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(new AllExceptionsFilter(httpAdapter));
  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      forbidUnknownValues: false,
    }),
  );

  const config = new DocumentBuilder().build();
  const document = SwaggerModule.createDocument(app, config);
  const options = {
    customCss,
    useGlobalPrefix: true,
  };
  SwaggerModule.setup('docs', app, document, options);
  const configService: ConfigService = app.get<ConfigService>(ConfigService);
  const port = configService.get('APP_PORT');
  await app.init();
  app.listen(port);
  return app;
}
