import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';

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
  ],
  providers: [CleanUpService],
})
export class AppModule {}
