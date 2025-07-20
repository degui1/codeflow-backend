import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { EnvModule } from './env/env.module';
import { HttpModule } from './http/http.module';
import { GatewayModule } from './gateway/gateway.module';
import { envSchema } from './env/env';

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: (env) => envSchema.parse(env),
      isGlobal: true,
    }),
    EnvModule,
    HttpModule,
    GatewayModule,
  ],
})
export class AppModule {}
