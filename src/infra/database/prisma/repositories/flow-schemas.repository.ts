import { FlowSchemasRepository } from 'src/domain/repositories/flow-schemas.repository';
import { PrismaService } from '../prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PrismaFlowSchemasRepository implements FlowSchemasRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async findById(id: string) {
    return this.prismaService.flowSchema.findUnique({ where: { id } });
  }
}
