import { APP_FILTER } from '@nestjs/core';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';

import { AllExceptionsFilter } from 'src/core/errors/all-exception-filter.filter';
import { LoggerModule } from 'src/core/logger/logger.module';

import { EnvModule } from './env/env.module';
import { HttpModule } from './http/http.module';
import { GatewayModule } from './gateway/gateway.module';
import { envSchema } from './env/env';
import { CleanUpService } from './core/clean-up.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: (env) => envSchema.parse(env),
      isGlobal: true,
    }),
    ScheduleModule.forRoot(),
    EnvModule,
    HttpModule,
    GatewayModule,
    LoggerModule,
  ],
  providers: [
    CleanUpService,
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
  ],
})
export class AppModule {}
