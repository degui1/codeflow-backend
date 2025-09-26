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

  private extractValuesFromInputs(inputs: FlowInput): any {
    const processFields = (fields: unknown): unknown => {
      if (Array.isArray(fields)) {
        return fields.map(processFields);
      }
      if (typeof fields === 'object' && fields !== null) {
        if ('keyName' in fields && fields.keyName && 'fields' in fields) {
          return {
            [fields.keyName as string]: processFields(fields.fields),
          };
        }

        if ('fields' in fields) {
          return processFields(fields.fields);
        }

        const result: Record<string, unknown> = {};

        for (const [key, value] of Object.entries(fields)) {
          const processed = processFields(value);

          if (
            typeof processed === 'object' &&
            processed !== null &&
            Object.keys(processed).length === 1 &&
            typeof value === 'object' &&
            value !== null &&
            'keyName' in value
          ) {
            Object.assign(result, processed);
          } else {
            result[key] = processed;
          }
        }

        return result;
      }

      return fields;
    };

    const output: Record<string, unknown> = {};
    for (const [, groupValue] of Object.entries(inputs.groups)) {
      if ('fields' in groupValue) {
        const processed = processFields(groupValue.fields);

        Object.assign(output, processed);
      }
    }
    return output;
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

    const flow = this.yaml.stringifyYaml(this.extractValuesFromInputs(inputs));

    return { flow };
  }
}
