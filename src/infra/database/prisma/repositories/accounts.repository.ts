import { Injectable } from '@nestjs/common';
import { Prisma } from 'generated/prisma';

import { AccountsRepository } from 'src/domain/repositories/accounts.repository';
import { Transaction } from 'src/core/utils/transaction';

import { PrismaService } from '../prisma.service';

@Injectable()
export class PrismaAccountsRepository implements AccountsRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async create(data: Prisma.AccountUncheckedCreateInput, tx: Transaction) {
    if (tx) {
      return tx.account.create({ data });
    }

    return this.prismaService.account.create({ data: data });
  }
}
