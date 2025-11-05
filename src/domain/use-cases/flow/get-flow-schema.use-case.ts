import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { Injectable } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';

import { CustomLoggerService } from 'src/core/logger/logger.service';
import { YamlSchema, yamlSchema } from 'src/core/schemas/flow.schema';
import { FlowSchemasRepository } from 'src/domain/repositories/flow-schemas.repository';
import { YamlService } from 'src/infra/yaml/yaml-js/yaml.service';

export interface GetFlowSchemaUseCaseRequest {
  flowSchemaId: string;
}

export interface GetFlowSchemaUseCaseResponse {
  schema: YamlSchema;
}

@Injectable()
export class GetFlowSchemaUseCase {
  constructor(
    private readonly flowSchemasRepository: FlowSchemasRepository,
    private readonly yamlService: YamlService,
    private readonly logger: CustomLoggerService,
  ) {}

  async execute({
    flowSchemaId,
  }: GetFlowSchemaUseCaseRequest): Promise<GetFlowSchemaUseCaseResponse> {
    const flowSchema = await this.flowSchemasRepository.findById(flowSchemaId);

    if (!flowSchema) {
      throw new WsException('Flow schema does not exist');
    }

    try {
      const filePath = resolve('./schemas/', flowSchema.file_name);
      const fileContent = readFileSync(filePath, 'utf-8');
      const yamlObject = this.yamlService.parseYaml(fileContent);

      const schema = yamlSchema.parse(yamlObject);

      return {
        schema,
      };
    } catch (error) {
      if (error instanceof Error) {
        this.logger.error(error.message, error.stack, 'WORKFLOW_BUILDER');

        throw new WsException({
          message: 'Unable to load flow schema',
          error: error.cause,
        });
      }

      this.logger.error(String(error), 'WORKFLOW_BUILDER');
      throw new WsException({
        message: 'Unable to load flow schema',
        error: String(error),
      });
    }
  }
}
