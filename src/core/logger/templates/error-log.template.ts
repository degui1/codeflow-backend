import { HttpException } from '@nestjs/common';

import { ICustomHttpExceptionResponse } from '../interfaces/http-exception-response.interface';

export function GenerateErrorLogTemplate(
  exceptionResponse: ICustomHttpExceptionResponse,
  exception: Error,
): string {
  const isHttpException = exception instanceof HttpException;

  const template = `
  --------------------------------------------------------------------------
  ERROR LOG

    [Response code: ${exceptionResponse.statusCode} - at ${new Date(exceptionResponse.timeStamp).toUTCString()}]
    [Method: ${exceptionResponse.method} :: Path: ${exceptionResponse.path}]

    ${
      isHttpException
        ? `
      [HTTP Exception name]
      ${exception.name ?? 'No exception name defined'}

      [HTTP Exception cause]
      ${JSON.stringify(exception.cause) ?? 'No exception cause defined'}

      [HTTP Exception message]
      ${exception.message ?? 'No exception message defined'}
    `
        : ''
    }
    [HTTP Exception description]
    ${exceptionResponse.error}

    [Exception stack]
    ${exception.stack ? exception.stack : 'No stack message'}
  --------------------------------------------------------------------------
  `;

  return template;
}
