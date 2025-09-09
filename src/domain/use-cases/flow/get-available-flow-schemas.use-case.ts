import { Injectable } from '@nestjs/common';
import { FlowSchema } from 'generated/prisma';

import { FlowSchemasRepository } from 'src/domain/repositories/flow-schemas.repository';

export interface GetAvailableFlowSchemasResponse {
  flowSchemas: FlowSchema[];
}

@Injectable()
export class GetAvailableFlowSchemas {
  constructor(private readonly flowSchemasRepository: FlowSchemasRepository) {}

  async execute(): Promise<GetAvailableFlowSchemasResponse> {
    const flowSchemas = await this.flowSchemasRepository.getAll();

    return {
      flowSchemas,
    };
  }
}
