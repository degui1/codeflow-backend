import { join, resolve } from 'node:path';
import { appendFile, existsSync, mkdirSync } from 'node:fs';
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

import { EnvService } from 'src/infra/env/env.service';

import { CustomLoggerService } from '../logger/logger.service';
import {
  ICustomHttpExceptionResponse,
  IHttpExceptionResponse,
} from '../logger/interfaces/http-exception-response.interface';
import { GenerateErrorLogTemplate } from '../logger/templates/error-log.template';

interface IGetErrorResponse {
  status: HttpStatus;
  errorMessage: string;
  request: Request;
}

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(
    private readonly logger: CustomLoggerService,
    private readonly envService: EnvService,
  ) {
    this.logger.setContext(AllExceptionsFilter.name);
  }

  catch(exception: Error, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const response = context.getResponse<Response>();
    const request = context.getRequest<Request>();

    let status: HttpStatus = HttpStatus.INTERNAL_SERVER_ERROR;
    let errorMessage: string = 'Internal Server error occurred!';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const errorResponse = exception.getResponse();

      if (status === HttpStatus.BAD_REQUEST) {
        errorMessage =
          typeof errorResponse === 'string'
            ? errorResponse
            : (errorResponse as IHttpExceptionResponse).message ||
              'Bad request';
      } else {
        errorMessage =
          typeof errorResponse === 'string'
            ? errorResponse
            : (errorResponse as IHttpExceptionResponse).message ||
              exception.message;
      }
    }

    const errorResponse = this.getErrorResponse({
      status,
      request,
      errorMessage,
    });

    this.writeErrorLogToFile(errorResponse, exception);

    response.status(status).json(errorResponse);

    this.logger.error(
      errorMessage,
      exception.stack ? exception.stack : 'No stack message',
    );
  }

  private getErrorResponse({
    status,
    errorMessage,
    request,
  }: IGetErrorResponse): ICustomHttpExceptionResponse {
    return {
      statusCode: status,
      error: errorMessage,
      path: request.url,
      method: request.method,
      timeStamp: new Date(),
      errorLogFilename: this.envService.get('ERROR_LOG_FILENAME'),
    };
  }

  public writeErrorLogToFile(
    errorResponse: ICustomHttpExceptionResponse,
    exception: Error,
  ): void {
    const logDir = resolve(this.envService.get('LOG_FOLDER'));

    if (!existsSync(logDir)) mkdirSync(logDir, { recursive: true });

    const errorLogTemplate = GenerateErrorLogTemplate(errorResponse, exception);

    const logFilePath = join(...[logDir, errorResponse.errorLogFilename]);

    appendFile(logFilePath, errorLogTemplate, 'utf-8', (err) => {
      if (err) {
        throw err;
      }
    });
  }
}
