import { NestFactory } from '@nestjs/core';
import { AppModule } from './infra/app.module';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    snapshot: true,
  });
  app.use(cookieParser());
  app.enableCors({
    origin: 'http://localhost:5173',
    methods: 'GET,POST,PUT,DELETE',
    credentials: true,
    headers: 'Content-Type, Authorization',
  });

  await app.listen(process.env.PORT ?? 3000);
}

void bootstrap();
