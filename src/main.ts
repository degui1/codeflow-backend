import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';

import { AppModule } from './infra/app.module';
import { EnvService } from './infra/env/env.service';
import { SocketIoAdapter } from './infra/gateway/adapters/socket-io.adapter';
import { CustomLoggerService } from './core/logger/logger.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    snapshot: true,
  });

  const envService = app.get<EnvService>(EnvService);

  const logger = new CustomLoggerService(envService);

  app.useLogger(logger);

  app.use(cookieParser());

  app.enableCors({
    origin: envService.get('CLIENT_BASE_URL'),
    methods: 'GET,POST,PUT,DELETE,PATCH',
    credentials: true,
    headers: 'Content-Type, Authorization',
  });

  app.useWebSocketAdapter(
    new SocketIoAdapter(app, {
      origin: envService.get('CLIENT_BASE_URL'),
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
      credentials: true,
    }),
  );

  await app.listen(envService.get('PORT') ?? 3000);

  logger.verbose(
    `Nest is running on port ${envService.get('PORT')} in ${envService.get('NODE_ENV')} mode`,
    'NestApplication',
  );
}

void bootstrap();
