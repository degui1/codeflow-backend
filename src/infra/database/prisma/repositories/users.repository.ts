import { Injectable } from '@nestjs/common';
import { Prisma, User } from 'generated/prisma';
import { Transaction } from 'src/domain/repositories/auth.repository';

import { UsersRepository } from 'src/domain/repositories/users.repository';
import { PrismaService } from 'src/infra/database/prisma/prisma.service';

@Injectable()
export class PrismaUsersRepository implements UsersRepository {
  constructor(private readonly prismaService: PrismaService) {}

  create(data: Prisma.UserUncheckedCreateInput, tx: Transaction) {
    if (tx) {
      return tx.user.create({ data });
    }

    return this.prismaService.user.create({ data });
  }

  findById(id: string): Promise<User | null> {
    return this.prismaService.user.findUnique({
      where: { id: id },
    });
  }

  findByEmail(email: string): Promise<User | null> {
    return this.prismaService.user.findUnique({
      where: { email: email },
    });
  }

  async delete(userId: string) {
    await this.prismaService.user.delete({ where: { id: userId } });
  }
}
