import { Account, Prisma } from 'generated/prisma';
import { Transaction } from './auth.repository';

export abstract class AccountsRepository {
  abstract create(
    data: Prisma.AccountUncheckedCreateInput,
    tx?: Transaction,
  ): Promise<Account>;
}
