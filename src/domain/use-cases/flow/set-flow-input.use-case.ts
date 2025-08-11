import { Injectable } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';

import { FlowInput } from 'src/core/schemas/data.schema';
import { YamlSchema } from 'src/core/schemas/flow.schema';
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

  private setValueAtPath(
    obj: FlowInput | undefined,
    path: string,
    value: unknown,
  ) {
    const parts = path.split('.').filter(Boolean);
    let curr = obj || {};

    for (let i = 0; i < parts.length - 1; i++) {
      const part = parts[i];
      if (!(part in curr)) curr[part] = {};

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

    if (!expression) {
      throw new WsException('Invalid field path');
    }

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
