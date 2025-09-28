import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';

import { AppModule } from './infra/app.module';
import { EnvService } from './infra/env/env.service';

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

  await app.listen(envService.get('PORT') ?? 3000);
}

void bootstrap();
