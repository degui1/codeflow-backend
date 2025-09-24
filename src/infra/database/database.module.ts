import { Module } from '@nestjs/common';

import { FlowSchemasRepository } from 'src/domain/repositories/flow-schemas.repository';
import { AuthRepository } from 'src/domain/repositories/auth.repository';
import { AccountsRepository } from 'src/domain/repositories/accounts.repository';
import { PostsRepository } from 'src/domain/repositories/posts.repository';
import { UsersRepository } from 'src/domain/repositories/users.repository';
import { SessionsRepository } from 'src/domain/repositories/sessions.repository';
import { FlowsRepository } from 'src/domain/repositories/flows.repository';
import { LikesRepository } from 'src/domain/repositories/likes.repository';

import { PrismaService } from './prisma/prisma.service';
import { PrismaSessionsRepository } from './prisma/repositories/sessions.repository';
import { PrismaUsersRepository } from './prisma/repositories/users.repository';
import { PrismaPostsRepository } from './prisma/repositories/posts.repository';
import { PrismaAccountsRepository } from './prisma/repositories/accounts.repository';
import { PrismaAuthRepository } from './prisma/repositories/auth.repository';
import { PrismaFlowSchemasRepository } from './prisma/repositories/flow-schemas.repository';
import { PrismaFlowsRepository } from './prisma/repositories/flows.repository';
import { PrismaLikesRepository } from './prisma/repositories/likes.repository';

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
    {
      provide: FlowsRepository,
      useClass: PrismaFlowsRepository,
    },
    {
      provide: LikesRepository,
      useClass: PrismaLikesRepository,
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
    FlowsRepository,
    LikesRepository,
  ],
})
export class DatabaseModule {}
