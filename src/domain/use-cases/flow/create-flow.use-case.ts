import { Injectable } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { FlowInput } from 'src/core/schemas/data.schema';
import { Rules } from 'src/core/schemas/flow.schema';
import { LanguageExpressionService } from 'src/infra/language-expression/jsonata/language-expression.service';

import { YamlService } from 'src/infra/yaml/yaml-js/yaml.service';

interface CreateFlowUseCaseRequest {
  inputs?: FlowInput;
  rules: Rules;
}

interface CreateFlowUseCaseResponse {
  flow: string;
}
@Injectable()
export class CreateFlowUseCase {
  constructor(
    private readonly yaml: YamlService,
    private readonly languageExpression: LanguageExpressionService,
  ) {}

  private flatFields(inputs: FlowInput) {
    const fields = Object.values(inputs.groups).flatMap(({ fields }) => fields);

    const flattedFields = fields.reduce((acc, group) => {
      return Object.assign(acc, group);
    }, {});

    return flattedFields;
  }

  async execute({
    inputs,
    rules = {},
  }: CreateFlowUseCaseRequest): Promise<CreateFlowUseCaseResponse> {
    if (!inputs) {
      throw new WsException('Inputs not provided');
    }

    const rulesOperation: {
      result: () => Promise<unknown>;
      description: string;
      error: string;
    }[] = [];

    Object.entries(rules).forEach(([, rule]) => {
      rulesOperation.push({
        result: async () =>
          await this.languageExpression.evaluateExpression(
            rule.condition,
            inputs,
          ),
        description: rule.description,
        error: rule.error,
      });
    });

    const validations = await Promise.all(
      rulesOperation.map(async ({ result, description, error }) => {
        const isValid = await result();

        return {
          isValid,
          description,
          error,
        };
      }),
    );

    const hasInvalidInput = validations.find(({ isValid }) => isValid !== true);

    if (hasInvalidInput) {
      throw new WsException({
        message: 'The following rule must be followed',
        error: hasInvalidInput.error,
        description: hasInvalidInput.description,
      });
    }

    const flow = this.yaml.stringifyYaml(this.flatFields(inputs));

    return { flow };
  }
}
