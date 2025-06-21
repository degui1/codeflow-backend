import { Injectable } from '@nestjs/common';

@Injectable()
export class CookieService {
  private readonly COOKIE_EXPIRE_TIME_SECONDS = 60 * 10; // 10 minutes

  getSessionCookieOptions() {
    return {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax' as const,
      maxAge: this.COOKIE_EXPIRE_TIME_SECONDS * 1000,
      path: '/',
    };
  }
}
