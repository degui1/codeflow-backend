import { Injectable } from '@nestjs/common';
import { EnvService } from '../env/env.service';

@Injectable()
export class CookieService {
  constructor(private readonly envService: EnvService) {}

  private readonly OAUTH_COOKIE_EXPIRE_TIME_SECONDS = 60 * 10; // 10 minutes
  private readonly SESSION_COOKIE_EXPIRE_TIME_SECONDS = 60 * 60 * 24 * 7; // 7 days

  getOAuthCookieOptions() {
    return {
      httpOnly: true,
      secure: this.envService.get('NODE_ENV') === 'production',
      sameSite: 'lax' as const,
      maxAge: this.OAUTH_COOKIE_EXPIRE_TIME_SECONDS * 1000,
      path: '/',
    };
  }

  getSessionCookieOptions() {
    return {
      httpOnly: true,
      secure: true,
      sameSite: 'none' as const,
      maxAge: this.SESSION_COOKIE_EXPIRE_TIME_SECONDS * 1000,
      path: '/',
    };
  }
}
