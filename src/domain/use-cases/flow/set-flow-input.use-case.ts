import { Injectable } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';

import { FlowInput } from 'src/core/schemas/data.schema';
import { Field, FieldSchema, YamlSchema } from 'src/core/schemas/flow.schema';
import { LanguageExpressionService } from 'src/infra/language-expression/jsonata/language-expression.service';

interface SetFlowInputUseCaseRequest {
  inputs: FlowInput;
  schema: YamlSchema;
  path: string;
  value: unknown;
}

interface SetFlowInputUseCaseResponse {
  inputs: FlowInput;
}

@Injectable()
export class SetFlowInputUseCase {
  constructor(private readonly languageExpression: LanguageExpressionService) {}

  private validateFieldValue(field: Field, value: unknown): void {
    const { type, itemType, fields, defaultValues } = field;

    if (defaultValues && !defaultValues.includes(value)) {
      throw new WsException(
        `Expected one of these values '${defaultValues.toString()}', but received ${String(value)}`,
      );
    }

    if (type === 'string' && typeof value !== 'string') {
      throw new WsException(
        `Expected type ${type}, but received ${typeof value}`,
      );
    }

    if (type === 'number' && typeof value !== 'number') {
      throw new WsException(
        `Expected type ${type}, but received ${typeof value}`,
      );
    }

    if (type === 'boolean' && typeof value !== 'boolean') {
      throw new WsException(
        `Expected type ${type}, but received ${typeof value}`,
      );
    }

    if (type === 'list') {
      if (!Array.isArray(value)) {
        throw new WsException(
          `Expected type ${type}, but received ${typeof value}`,
        );
      }

      if (itemType === 'object' && fields) {
        for (const item of value) {
          this.validateFieldValue({ type: 'object', fields }, item);
        }
      } else if (itemType) {
        for (const item of value) {
          this.validateFieldValue({ type: itemType }, item);
        }
      }
    }

    if (type === 'object') {
      if (typeof value !== 'object' || value === null || Array.isArray(value)) {
        throw new WsException(
          `Expected type ${type}, but received ${typeof value}`,
        );
      }

      if (fields) {
        for (const key in fields) {
          if (fields[key].required && !(key in value)) {
            throw new WsException(`Missing required field: ${key}`);
          }
          if (key in value) {
            this.validateFieldValue(fields[key], value[key]);
          }
        }
      }
    }
  }

  private setValueAtPath(
    obj: FlowInput | undefined,
    path: string,
    value: unknown,
  ) {
    const parts = path.split('.').filter(Boolean);
    let curr = obj || {};

    for (let i = 0; i < parts.length - 1; i++) {
      const part = parts[i];
      if (!(part in curr)) {
        if (part === 'nameable') {
          curr[String(value)] = {};
        } else {
          curr[part] = {};
        }
      }

      curr = curr[part] as Record<string, unknown>;
    }
    curr[parts[parts.length - 1]] = value;
  }

  async execute({
    inputs,
    path,
    schema,
    value,
  }: SetFlowInputUseCaseRequest): Promise<SetFlowInputUseCaseResponse> {
    const expression = await this.languageExpression.evaluateExpression(
      path,
      schema,
    );

    if (!expression || typeof expression !== 'object') {
      throw new WsException('Invalid field path');
    }

    const field = FieldSchema.parse(expression);

    this.validateFieldValue(field, value);

    // if (typeof expression === 'object' && 'rules' in expression) {
    //   const rules = expression.rules as Record<string, Rule>;

    //   const rulesOperation: {
    //     result: () => Promise<unknown>;
    //     description: string;
    //     error: string;
    //   }[] = [];

    //   Object.entries(rules).forEach(([, rule]) => {
    //     rulesOperation.push({
    //       result: async () =>
    //         await this.languageExpression.evaluateExpression(
    //           rule.condition,
    //           inputs,
    //         ),
    //       description: rule.description,
    //       error: rule.error,
    //     });
    //   });

    //   const validations = await Promise.all(
    //     rulesOperation.map(async ({ result, description, error }) => {
    //       const isValid = await result();

    //       return {
    //         isValid,
    //         description,
    //         error,
    //       };
    //     }),
    //   );

    //   const hasInvalidInput = validations.find(
    //     ({ isValid }) => isValid !== true,
    //   );

    //   if (hasInvalidInput) {
    //     throw new WsException({
    //       message: 'The following rule must be followed',
    //       error: hasInvalidInput.error,
    //       description: hasInvalidInput.description,
    //     });
    //   }
    // }

    // console.log(expression);

    this.setValueAtPath(inputs, path, value);

    return {
      inputs,
    };
  }
}
