import { Injectable } from '@nestjs/common';
import { Account, Session, User } from 'generated/prisma';

import {
  AuthRepository,
  RegisterUserProps,
} from 'src/domain/repositories/auth.repository';

import { PrismaService } from '../prisma.service';
import { AccountsRepository } from 'src/domain/repositories/accounts.repository';
import { SessionsRepository } from 'src/domain/repositories/sessions.repository';
import { UsersRepository } from 'src/domain/repositories/users.repository';

@Injectable()
export class PrismaAuthRepository implements AuthRepository {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly accountsRepository: AccountsRepository,
    private readonly sessionsRepository: SessionsRepository,
    private readonly usersRepository: UsersRepository,
  ) {}

  async registerUser({
    data: {
      accessToken,
      email,
      image,
      name,
      oauthUserId,
      provider,
      sessionExpires,
      sessionToken,
      tokenType,
      username,
    },
  }: RegisterUserProps): Promise<[User, Account, Session]> {
    return this.prismaService.$transaction(async (tx) => {
      const user = await this.usersRepository.create(
        { email, username, name, image },
        tx,
      );

      const account = await this.accountsRepository.create(
        {
          user_id: user.id,
          provider,
          provider_account_id: oauthUserId,
          type: 'oauth',
          access_token: accessToken,
          token_type: tokenType,
        },
        tx,
      );

      const session = await this.sessionsRepository.createUserSession(
        {
          user_id: user.id,
          expires: sessionExpires,
          session_token: sessionToken,
        },
        tx,
      );

      return [user, account, session];
    });
  }
}
