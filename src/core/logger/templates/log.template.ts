import { LogLevel } from '@nestjs/common';

export function GenerateLogTemplate(
  message: unknown,
  logLevel: LogLevel,
  context?: string,
): string {
  const template = `
  --------------------------------------------------------------------------
  [${logLevel}] ${context ? `[${context}]` : ''} - [at ${new Date().toUTCString()}]
  [${String(message)}]
  --------------------------------------------------------------------------
  `;

  return template;
}
