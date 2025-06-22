import { Request } from 'express';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { SessionsRepository } from 'src/domain/repositories/sessions.repository';

import { IS_PUBLIC_KEY } from '../http/decorators/public.decorator';

const SESSION_COOKIE_KEY = 'session_cookie';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly sessionsRepository: SessionsRepository,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest<Request>();
    const sessionCookie = String(request.cookies[SESSION_COOKIE_KEY]);

    if (!sessionCookie) {
      throw new UnauthorizedException();
    }

    const session = await this.sessionsRepository.findByToken(sessionCookie);

    if (!session) {
      throw new UnauthorizedException();
    }

    const isExpired = session.expires.getTime() < Date.now();

    if (isExpired) {
      throw new UnauthorizedException();
    }

    return true;
  }
}
