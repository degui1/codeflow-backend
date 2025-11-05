import {
  ConsoleLogger,
  Injectable,
  LoggerService,
  LogLevel,
  Scope,
} from '@nestjs/common';
import { appendFile, existsSync, mkdirSync } from 'node:fs';
import { join, resolve } from 'node:path';

import { EnvService } from 'src/infra/env/env.service';
import { GenerateLogTemplate } from './templates/log.template';

@Injectable({ scope: Scope.TRANSIENT })
export class CustomLoggerService
  extends ConsoleLogger
  implements LoggerService
{
  constructor(private readonly envService: EnvService) {
    super();
  }

  private saveLogToFile(
    message: unknown,
    logLevel: LogLevel,
    context?: string,
  ) {
    const logDir = resolve(this.envService.get('LOG_FOLDER'));

    if (!existsSync(logDir)) mkdirSync(logDir, { recursive: true });

    const logFile = this.envService.get('LOG_FILENAME');
    const logFilePath = join(...[logDir, logFile]);

    appendFile(
      logFilePath,
      GenerateLogTemplate(message, logLevel, context),
      'utf-8',
      (error) => {
        if (error) throw error;
      },
    );
  }

  log(message: unknown, context?: string): void {
    const contextValue = context ?? this.context;

    if (contextValue) super.log(message, contextValue);
    else super.log(message);

    this.saveLogToFile(message, 'log', contextValue);
  }

  error(message: unknown, stack?: string, context?: string): void {
    const contextValue = context ?? this.context;

    if (contextValue) super.error(message, stack, contextValue);
    else if (stack) super.error(message, stack);
    else super.error(message);

    this.saveLogToFile(message, 'error', contextValue);
  }

  warn(message: unknown, context?: string): void {
    const contextValue = context ?? this.context;

    if (contextValue) super.warn(message, contextValue);
    else super.warn(message);

    this.saveLogToFile(message, 'warn', contextValue);
  }

  debug(message: unknown, context?: string): void {
    const contextValue = context ?? this.context;

    if (contextValue) super.debug(message, contextValue);
    else super.debug(message);

    this.saveLogToFile(message, 'debug', contextValue);
  }

  fatal(message: unknown, context?: string): void {
    const contextValue = context ?? this.context;

    if (contextValue) super.fatal(message, contextValue);
    else super.fatal(message);

    this.saveLogToFile(message, 'fatal', contextValue);
  }
}
