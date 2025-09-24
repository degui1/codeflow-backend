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

  async updateById(
    flowId: string,
    data?: Prisma.FlowUncheckedUpdateInput,
    tx?: Transaction,
  ) {
    if (!data) {
      return;
    }

    const service = tx ?? this.prismaService;

    await service.flow.update({
      data: {
        ...(data.content && { content: data.content }),
      },
      where: {
        id: flowId,
      },
    });
  }
}
