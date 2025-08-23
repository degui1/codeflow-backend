import { PipeTransform } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { ZodError, ZodSchema } from 'zod';
import { fromZodError } from 'zod-validation-error';

export class ZodValidationPipe<T extends ZodSchema> implements PipeTransform {
  constructor(private schema: T) {}

  transform(body: unknown) {
    try {
      return this.schema.parse(body) as T;
    } catch (error) {
      if (error instanceof ZodError) {
        throw new WsException({
          name: 'Validation failed',
          errors: fromZodError(error).message,
        });
      }

      throw new WsException('Validation failed');
    }
  }
}
