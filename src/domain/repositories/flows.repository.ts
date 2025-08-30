import { Flow, Prisma } from 'generated/prisma';
import { Transaction } from 'src/core/utils/transaction';

export abstract class FlowsRepository {
  abstract create(
    data: Prisma.FlowUncheckedCreateInput,
    tx?: Transaction,
  ): Promise<Flow>;
}
