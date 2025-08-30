import { Injectable } from '@nestjs/common';

import { FlowsRepository } from 'src/domain/repositories/flows.repository';

import { PrismaService } from '../prisma.service';
import { Flow, Prisma } from 'generated/prisma';
import { Transaction } from 'src/core/utils/transaction';

@Injectable()
export class PrismaFlowsRepository implements FlowsRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async create(
    data: Prisma.FlowUncheckedCreateInput,
    tx?: Transaction,
  ): Promise<Flow> {
    if (tx) {
      return tx.flow.create({ data });
    }

    return this.prismaService.flow.create({ data });
  }
}
