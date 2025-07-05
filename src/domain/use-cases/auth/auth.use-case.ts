import { Injectable } from '@nestjs/common';
import { Provider } from 'generated/prisma';

import { SessionsRepository } from '../../repositories/sessions.repository';
import { UsersRepository } from '../../repositories/users.repository';
import { AccountsRepository } from 'src/domain/repositories/accounts.repository';
import { AuthRepository } from 'src/domain/repositories/auth.repository';

interface AuthUseCaseRequest {
  email: string;
  sessionToken: string;
  accessToken: string;
  name: string;
  provider: keyof typeof Provider;
  oauthUserId: string;
  tokenType: string;
  username: string;
  image: string;
}

const SESSION_EXPIRE_IN_SECONDS = 60 * 60 * 24 * 7;

@Injectable()
export class AuthUseCase {
  constructor(
    private readonly sessionsRepository: SessionsRepository,
    private readonly usersRepository: UsersRepository,
    private readonly accountsRepository: AccountsRepository,
    private readonly authRepository: AuthRepository,
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
    image,
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

    await this.authRepository.registerUser({
      data: {
        accessToken,
        email,
        name,
        oauthUserId,
        provider,
        sessionExpires,
        sessionToken,
        tokenType,
        username,
        image,
      },
      createAccountFn: (data, tx) => this.accountsRepository.create(data, tx),
      createSessionFn: this.sessionsRepository.createUserSession,
      createUserFn: (data, tx) => this.usersRepository.create(data, tx),
    });
  }
}
