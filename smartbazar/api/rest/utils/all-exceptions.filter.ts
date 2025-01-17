import { Catch, ArgumentsHost } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Response } from 'express';

const exceptionList = [
  'Cannot GET /',
  'Cannot GET /favicon.ico',
  'Cannot GET /_next/webpack-hmr',
];
@Catch()
export class AllExceptionsFilter extends BaseExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    if (!exceptionList.includes(exception?.response?.message)) {
      console.error(exception);

      const ctx = host.switchToHttp();
      const response = ctx.getResponse<Response>();
      const message = exception.message.replace(/\n/g, '');

      response.status(exception?.status || exception?.response?.status).json({
        statusCode: exception.status,
        message: message,
      });
    }
    super.catch(exception, host);
  }
}
