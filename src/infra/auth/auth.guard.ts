import { Request, Response } from 'express';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { UsersRepository } from 'src/domain/repositories/users.repository';
import { ClearSessionUseCase } from 'src/domain/use-cases/auth/clear-session.use-case';
import { SessionsRepository } from 'src/domain/repositories/sessions.repository';

import { IS_PUBLIC_KEY } from '../http/decorators/public.decorator';

const SESSION_COOKIE_KEY = 'session_cookie';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly sessionsRepository: SessionsRepository,
    private readonly usersRepository: UsersRepository,
    private readonly clearSessionUseCase: ClearSessionUseCase,
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
    const response = context.switchToHttp().getResponse<Response>();
    const sessionCookie = String(request.cookies[SESSION_COOKIE_KEY]);

    if (!sessionCookie) {
      response.clearCookie(SESSION_COOKIE_KEY);
      throw new UnauthorizedException();
    }

    const session = await this.sessionsRepository.findByToken(sessionCookie);

    if (!session) {
      response.clearCookie(SESSION_COOKIE_KEY);
      throw new UnauthorizedException();
    }

    const isExpired = session.expires.getTime() < Date.now();

    if (isExpired) {
      await this.clearSessionUseCase.execute({
        sessionToken: session.session_token,
      });

      response.clearCookie(SESSION_COOKIE_KEY);
      throw new UnauthorizedException();
    }

    const user = await this.usersRepository.findById(session.user_id);

    if (!user) {
      await this.clearSessionUseCase.execute({
        sessionToken: session.session_token,
      });
      response.clearCookie(SESSION_COOKIE_KEY);
      throw new UnauthorizedException();
    }

    request['userId'] = user.id;

    return true;
  }
}
