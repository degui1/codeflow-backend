import { Injectable } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { FlowInput } from 'src/core/schemas/data.schema';

import { YamlService } from 'src/infra/yaml/yaml-js/yaml.service';

interface CreateFlowUseCaseRequest {
  inputs?: FlowInput;
}

interface CreateFlowUseCaseResponse {
  flow: string;
}
@Injectable()
export class CreateFlowUseCase {
  constructor(private readonly yaml: YamlService) {}

  private flatFields(inputs: FlowInput) {
    const fields = Object.values(inputs.groups).flatMap(({ fields }) => fields);

    const flattedFields = fields.reduce((acc, group) => {
      return Object.assign(acc, group);
    }, {});

    return flattedFields;
  }

  execute({ inputs }: CreateFlowUseCaseRequest): CreateFlowUseCaseResponse {
    if (!inputs) {
      throw new WsException('Inputs not provided');
    }

    const flow = this.yaml.stringifyYaml(this.flatFields(inputs));

    return { flow };
  }
}
