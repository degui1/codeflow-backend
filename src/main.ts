import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';

import { AppModule } from './infra/app.module';
import { EnvService } from './infra/env/env.service';
import { SocketIoAdapter } from './infra/gateway/adapters/socket-io.adapter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    snapshot: true,
  });
  app.use(cookieParser());

  const envService = app.get<EnvService>(EnvService);

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
}

void bootstrap();
