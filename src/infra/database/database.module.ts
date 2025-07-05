import { Module } from '@nestjs/common';
import { SessionsRepository } from 'src/domain/repositories/sessions.repository';

import { PrismaService } from './prisma/prisma.service';
import { PrismaSessionsRepository } from './prisma/repositories/sessions.repository';
import { UsersRepository } from 'src/domain/repositories/users.repository';
import { PrismaUsersRepository } from './prisma/repositories/users.repository';
import { PostsRepository } from 'src/domain/repositories/posts.repository';
import { PrismaPostsRepository } from './prisma/repositories/posts.repository';
import { AccountsRepository } from 'src/domain/repositories/accounts.repository';
import { PrismaAccountsRepository } from './prisma/repositories/accounts.repository';
import { AuthRepository } from 'src/domain/repositories/auth.repository';
import { PrismaAuthRepository } from './prisma/repositories/auth.repository';

@Module({
  providers: [
    PrismaService,
    {
      provide: SessionsRepository,
      useClass: PrismaSessionsRepository,
    },
    {
      provide: UsersRepository,
      useClass: PrismaUsersRepository,
    },
    {
      provide: PostsRepository,
      useClass: PrismaPostsRepository,
    },
    {
      provide: AccountsRepository,
      useClass: PrismaAccountsRepository,
    },
    {
      provide: AuthRepository,
      useClass: PrismaAuthRepository,
    },
  ],
  exports: [
    PrismaService,
    SessionsRepository,
    UsersRepository,
    PostsRepository,
    AccountsRepository,
    AuthRepository,
  ],
})
export class DatabaseModule {}
