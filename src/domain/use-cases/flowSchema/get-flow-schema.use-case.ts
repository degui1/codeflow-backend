import { Injectable } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import { YamlSchema, yamlSchema } from 'src/core/schemas/flow.schema';
import { FlowSchemasRepository } from 'src/domain/repositories/flow-schemas.repository';
import { parse, stringify } from 'yaml';

export interface GetFlowSchemaUseCaseRequest {
  flowSchemaId: string;
}

export interface GetFlowSchemaUseCaseResponse {
  schema: YamlSchema;
}

@Injectable()
export class GetFlowSchemaUseCase {
  constructor(private readonly flowSchemasRepository: FlowSchemasRepository) {}

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
      const fileContent2 = readFileSync(
        'C:\\projects\\TCC\\codeflow-backend\\schemas\\github-actions copy.yaml',
        'utf-8',
      );
      const yaml = parse(fileContent2);
      // const schema = yamlSchema.parse(parse(fileContent));
      const schema = yamlSchema.parse(parse(fileContent));
      const string = stringify(yaml);
      return {
        schema,
      };
    } catch {
      throw new WsException('Unable to load flow schema');
    }
  }
}
