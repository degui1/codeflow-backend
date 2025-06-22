import { Module } from '@nestjs/common';

import { CookieService } from './cookie.service';
import { DatabaseModule } from '../database/database.module';
import { OAuthService } from './auth.service';
import { EnvModule } from '../env/env.module';

@Module({
  imports: [DatabaseModule, EnvModule],
  providers: [CookieService, OAuthService],
  exports: [CookieService, OAuthService],
})
export class AuthModule {}
