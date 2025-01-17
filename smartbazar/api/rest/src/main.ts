import fs from 'fs';
import { join } from 'path';
import { ValidationPipe } from '@nestjs/common';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from '../utils/all-exceptions.filter';

export async function createApp() {
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
  };
  SwaggerModule.setup('docs', app, document, options);
  const PORT = process.env.PORT || 5001;
  await app.listen(PORT);
  console.log(`Application is running on: ${await app.getUrl()}`);
}

createApp();
