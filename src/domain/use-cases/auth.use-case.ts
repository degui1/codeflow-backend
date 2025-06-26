import { Injectable } from '@nestjs/common';
import { Provider } from 'generated/prisma';

import { SessionsRepository } from '../repositories/sessions.repository';
import { UsersRepository } from '../repositories/users.repository';

interface AuthUseCaseRequest {
  email: string;
  sessionToken: string;
  accessToken: string;
  name: string;
  provider: keyof typeof Provider;
  oauthUserId: string;
  tokenType: string;
  username: string;
}

const SESSION_EXPIRE_IN_SECONDS = 60 * 60 * 24 * 7;

@Injectable()
export class AuthUseCase {
  constructor(
    private readonly sessionsRepository: SessionsRepository,
    private readonly usersRepository: UsersRepository,
  ) {}

  async execute({
    email,
    sessionToken,
    accessToken,
    name,
    oauthUserId,
    provider,
    tokenType,
    username,
  }: AuthUseCaseRequest): Promise<void> {
    const user = await this.usersRepository.findByEmail(email);

    const sessionExpires = new Date(
      Date.now() + SESSION_EXPIRE_IN_SECONDS * 1000,
    );

    if (user) {
      await this.sessionsRepository.createUserSession({
        expires: sessionExpires,
        session_token: sessionToken,
        user_id: user.id,
      });

      return;
    }

    await this.usersRepository.registerUser({
      accessToken,
      email,
      name,
      oauthUserId,
      provider,
      sessionExpires,
      sessionToken,
      tokenType,
      username,
    });
  }
}
