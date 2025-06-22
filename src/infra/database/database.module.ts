import { Module } from '@nestjs/common';
import { SessionsRepository } from 'src/domain/repositories/sessions.repository';

import { PrismaService } from './prisma/prisma.service';
import { PrismaSessionsRepository } from './prisma/repositories/sessions.repository';
import { UsersRepository } from 'src/domain/repositories/users.repository';
import { PrismaUsersRepository } from './prisma/repositories/users.repository';

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
  ],
  exports: [PrismaService, SessionsRepository, UsersRepository],
})
export class DatabaseModule {}
