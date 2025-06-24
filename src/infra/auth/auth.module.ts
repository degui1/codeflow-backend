import { Module } from '@nestjs/common';

import { CookieService } from './cookie.service';
import { DatabaseModule } from '../database/database.module';
import { EnvModule } from '../env/env.module';
import { OAuthDiscordService } from './oauth-discord.service';
import { OAuthGitHubService } from './oauth-github.service';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './auth.guard';

@Module({
  imports: [DatabaseModule, EnvModule],
  providers: [
    CookieService,
    OAuthDiscordService,
    OAuthGitHubService,
    { provide: APP_GUARD, useClass: AuthGuard },
  ],
  exports: [CookieService, OAuthDiscordService, OAuthGitHubService],
})
export class AuthModule {}
