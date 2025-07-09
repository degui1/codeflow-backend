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
import { FlowSchemasRepository } from 'src/domain/repositories/flow-schemas.repository';
import { PrismaFlowSchemasRepository } from './prisma/repositories/flow-schemas.repository';

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
    {
      provide: FlowSchemasRepository,
      useClass: PrismaFlowSchemasRepository,
    },
  ],
  exports: [
    PrismaService,
    SessionsRepository,
    UsersRepository,
    PostsRepository,
    AccountsRepository,
    AuthRepository,
    FlowSchemasRepository,
  ],
})
export class DatabaseModule {}
