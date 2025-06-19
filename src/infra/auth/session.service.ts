import { Injectable } from '@nestjs/common';
import crypto from 'crypto';
import { SessionsRepository } from 'src/domain/session/repositories/prisma/session.service';

const COOKIE_EXPIRE_TIME_SECONDS = 60 * 60 * 24; // 1 day
const COOKIE_SESSION_KEY = 'session-id';

@Injectable()
export class SessionService {
  private _cookieSessionKey = COOKIE_SESSION_KEY;

  get cookieSessionKey() {
    return this._cookieSessionKey;
  }

  constructor(private readonly sessionsRepository: SessionsRepository) {}

  async createUserSession(userId: string) {
    const sessionToken = crypto.randomBytes(512).toString('hex').normalize();
    const expires = Date.now() + COOKIE_EXPIRE_TIME_SECONDS * 1000;

    await this.sessionsRepository.create({
      session_token: sessionToken,
      expires: new Date(expires),
      user_id: userId,
    });

    return {
      sessionToken,
      cookieOptions: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax' as const,
        maxAge: COOKIE_EXPIRE_TIME_SECONDS * 1000,
        path: '/',
      },
    };
  }

  async updateSessionExpiration(sessionToken: string) {
    const newExpires = Date.now() + COOKIE_EXPIRE_TIME_SECONDS * 1000;

    await this.sessionsRepository.updateExpiresTime(
      sessionToken,
      new Date(newExpires),
    );

    return {
      sessionToken,
      cookieOptions: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax' as const,
        maxAge: COOKIE_EXPIRE_TIME_SECONDS * 1000,
        path: '/',
      },
    };
  }

  async clearUserSession(sessionToken: string) {
    await this.sessionsRepository.deleteSession(sessionToken);
    return {
      cookieOptions: {
        path: '/',
      },
    };
  }
}
