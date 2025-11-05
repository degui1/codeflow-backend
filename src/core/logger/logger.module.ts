import { Module } from '@nestjs/common';

import { EnvModule } from 'src/infra/env/env.module';

import { CustomLoggerService } from './logger.service';

@Module({
  imports: [EnvModule],
  providers: [CustomLoggerService],
  exports: [CustomLoggerService],
})
export class LoggerModule {}
