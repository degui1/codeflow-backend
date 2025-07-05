import { Injectable } from '@nestjs/common';
import { Account, Session, User } from 'generated/prisma';

import {
  AuthRepository,
  RegisterUserProps,
} from 'src/domain/repositories/auth.repository';

import { PrismaService } from '../prisma.service';

@Injectable()
export class PrismaAuthRepository implements AuthRepository {
  constructor(private readonly prismaService: PrismaService) {}

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
    createAccountFn,
    createSessionFn,
    createUserFn,
  }: RegisterUserProps): Promise<[User, Account, Session]> {
    return this.prismaService.$transaction(async (tx) => {
      const user = await createUserFn({ email, username, name, image }, tx);

      const account = await createAccountFn(
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

      const session = await createSessionFn(
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
