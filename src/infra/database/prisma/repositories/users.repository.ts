import { Injectable } from '@nestjs/common';
import { User } from 'generated/prisma';

import {
  RegisterUserInput,
  UsersRepository,
} from 'src/domain/repositories/users.repository';
import { PrismaService } from 'src/infra/database/prisma/prisma.service';

@Injectable()
export class PrismaUsersRepository implements UsersRepository {
  constructor(private readonly prismaService: PrismaService) {}

  findByEmail(email: string): Promise<User | null> {
    return this.prismaService.user.findUnique({
      where: { email: email },
    });
  }

  async registerUser({
    email,
    accessToken,
    name,
    oauthUserId,
    tokenType,
    username,
    sessionExpires,
    sessionToken,
    provider,
  }: RegisterUserInput) {
    await this.prismaService.$transaction(async (prisma) => {
      let userRecord = await prisma.user.findUnique({
        where: { email: email },
      });

      if (!userRecord) {
        const newUser = await prisma.user.create({
          data: {
            email,
            username,
            name,
          },
        });

        userRecord = newUser;
      }

      await prisma.account.create({
        data: {
          user_id: userRecord.id,
          provider: provider,
          provider_account_id: oauthUserId,
          access_token: accessToken,
          token_type: tokenType,
          type: 'oauth',
        },
      });

      await prisma.session.create({
        data: {
          user_id: userRecord.id,
          expires: sessionExpires,
          session_token: sessionToken,
        },
      });
    });
  }
}
