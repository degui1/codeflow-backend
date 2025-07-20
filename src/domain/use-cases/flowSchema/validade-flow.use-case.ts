import { Injectable } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';

import { InputSchema } from 'src/core/schemas/flow-input.schema';
import { Field, Group, YamlSchema } from 'src/core/schemas/flow.schema';
import { LanguageExpressionService } from 'src/infra/language-expression/jsonata/language-expression.service';
import { stringify } from 'yaml';

export interface ValidadeFlowUseCaseRequest {
  schema: YamlSchema;
  input: InputSchema;
}

@Injectable()
export class ValidadeFlowFieldUseCase {
  constructor(private languageExpressionService: LanguageExpressionService) {}

  // async validateFieldRules(field: Field, data: unknown) {
  //   if (!field.rules) return;

  //   for (const rule of field.rules) {
  //     const result = !!(await this.languageExpressionService.evaluateExpression(
  //       rule.condition,
  //       data,
  //     ));

  //     if (!result) throw new WsException(rule.error);
  //   }
  // }

  // async validateGroupRules(group: Group, data: unknown) {
  //   if (!group.rules) return;
  //   for (const rule of group.rules) {
  //     const result = !!(await this.languageExpressionService.evaluateExpression(
  //       rule.condition,
  //       data,
  //     ));

  //     if (!result) throw new WsException(rule.error);
  //   }
  // }

  // async validateSchemaRules(schema: YamlSchema, data: unknown) {
  //   if (!schema.rules) return;

  //   for (const rule of schema.rules) {
  //     const result = !!(await this.languageExpressionService.evaluateExpression(
  //       rule.condition,
  //       data,
  //     ));
  //     if (!result) throw new WsException(rule.error);
  //   }
  // }

  collectFields(fieldsObj: Record<string, Field>): Field[] {
    const result: Field[] = [];
    for (const fieldKey in fieldsObj) {
      const field = fieldsObj[fieldKey];
      result.push(field);
      // Se o field tem fields aninhados, coleta também
      if (field.fields) {
        result.push(...this.collectFields(field.fields));
      }
    }
    return result;
  }

  getAllFieldsFromData(data: {
    groups: Record<string, { fields: Record<string, Field> }>;
  }) {
    const allFields: Field[] = [];
    for (const groupKey in data.groups) {
      const group = data.groups[groupKey];
      allFields.push(...this.collectFields(group.fields));
    }
    return allFields;
  }

  // toYamlObject(data: unknown) {
  //   const fields = this.getAllFieldsFromData(data);

  //   const yamlString = stringify(fields);

  //   return yamlString;
  // }

  getFieldFromSchema(
    schema: any,
    groupKey: string,
    path: (string | number)[],
  ): any {
    let curr = schema.groups[groupKey].fields;
    for (let i = 0; i < path.length; i++) {
      const key = path[i];
      if (typeof key === 'number') {
        // Se for array, pegue o itemType e continue
        if (curr.itemType === 'object' && curr.fields) {
          curr = curr.fields;
        } else {
          throw new Error('Schema inconsistente para array');
        }
      } else {
        if (curr[key]?.fields) {
          curr = curr[key].fields;
        } else {
          curr = curr[key];
        }
      }
    }
    return curr;
  }

  getFieldFromSchema2(
    schema: YamlSchema,
    groupKey: string,
    path: (string | number)[],
  ) {}

  // async execute({ input, schema }: ValidadeFlowFieldUseCaseRequest) {}

  // async execute({ input, schema }: ValidadeFlowFieldUseCaseRequest) {
  //   if ('index' in input) {
  //     const rules = jsonata(
  //       `$groups.${input.groupKey}.fields${input.index}.${input.fieldKey}.rules`,
  //     ).evaluate(schema);
  //   }

  //   const field = (await jsonata(
  //     `$groups.${input.groupKey}.fields.${input.fieldKey}`,
  //   ).evaluate(schema)) as Field;

  //   const data = await validateRules([field], [input]);

  //   return data; // alguma estrutura que tenha campo e valor
  // }
}

// {
//   "groups": {
//     "on": {
//       "on": ["push", "pull_request"],
//       "branches": ["main", "dev"]
//     },
//     "jobs": [
//       {
//         "name": "build",
//         "runs-on": "ubuntu-latest",
//         "steps": [
//           { "name": "Install", "run": "npm install" },
//           { "name": "Test", "run": "npm test" }
//         ]
//       }
//     ]
//   }
// }

// function validateFlowField(inputs: InputSchema[]) {
//   const data = { groups: {} };

//   for (const update of inputs) {
//     const { groupKey, fieldKey, value } = update;
//     if ('index' in update) {
//       if (!data.groups[groupKey]) data.groups[groupKey] = [];
//       if (!data.groups[groupKey][update.index])
//         data.groups[groupKey][update.index] = {};
//       data.groups[groupKey][update.index][fieldKey] = value;
//     } else {
//       // grupo non‑repeatable
//       if (!data.groups[groupKey]) data.groups[groupKey] = {};
//       data.groups[groupKey][fieldKey] = value;
//     }
//   }
//   return data;
// }

// async function validateRules(fields: Field[], inputs: InputSchema[]) {
//   const data = validateFlowField(inputs);

//   for (const field of fields) {
//     const { rules = [] } = field;

//     for (const rule of rules) {
//       const { condition, error } = rule;
//       const result = await jsonata(condition).evaluate(data);

//       if (!result) {
//         throw new WsException(error);
//       }
//     }
//   }

//   return data;
// }
