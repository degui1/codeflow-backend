import {
  BadGatewayException,
  BadRequestException,
  Injectable,
} from '@nestjs/common';
import { YamlSchema, yamlSchema } from 'src/core/schemas/flow.schema';
import { FlowSchemasRepository } from 'src/domain/repositories/flow-schemas.repository';

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
      throw new BadRequestException('Flow schema does not exist');
    }

    try {
      const fileContent = Buffer.from(flowSchema.blob).toString('utf-8');

      const schema = yamlSchema.parse(fileContent);

      return {
        schema,
      };
    } catch {
      throw new BadGatewayException('Unable to load flow schema');
    }
  }
}
