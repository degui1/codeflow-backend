import { Account, Prisma } from 'generated/prisma';

import { Transaction } from 'src/core/utils/transaction';

export abstract class AccountsRepository {
  abstract create(
    data: Prisma.AccountUncheckedCreateInput,
    tx?: Transaction,
  ): Promise<Account>;
}
