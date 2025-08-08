import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { EnvService } from 'src/infra/env/env.service';

export interface CreateFlowFileUseCaseRequest {
  flow: string;
}

export interface CreateFlowFileUseCaseResponse {
  path: string;
}

@Injectable()
export class CreateFlowFileUseCase {
  constructor(private readonly envService: EnvService) {}

  execute({
    flow,
  }: CreateFlowFileUseCaseRequest): CreateFlowFileUseCaseResponse {
    const filename = `flow-${randomUUID()}.yaml`;
    const filepath = resolve(this.envService.get('TEMPORARY_FOLDER'), filename);

    writeFileSync(filepath, flow, { encoding: 'utf-8' });

    return {
      path: filepath,
    };
  }
}
