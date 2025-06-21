import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    snapshot: true, // for debugging purposes
  });
  // app.enableCors({
  //   origin: process.env.CORS_ORIGIN ?? 'http://localhost:3000',
  //   credentials: true,
  // });
  app.use(cookieParser());

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
