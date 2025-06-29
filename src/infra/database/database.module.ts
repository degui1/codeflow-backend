import { Module } from '@nestjs/common';
import { SessionsRepository } from 'src/domain/repositories/sessions.repository';

import { PrismaService } from './prisma/prisma.service';
import { PrismaSessionsRepository } from './prisma/repositories/sessions.repository';
import { UsersRepository } from 'src/domain/repositories/users.repository';
import { PrismaUsersRepository } from './prisma/repositories/users.repository';
import { PostsRepository } from 'src/domain/repositories/posts.repository';
import { PrismaPostsRepository } from './prisma/repositories/posts.repository';

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
  ],
  exports: [
    PrismaService,
    SessionsRepository,
    UsersRepository,
    PostsRepository,
  ],
})
export class DatabaseModule {}
