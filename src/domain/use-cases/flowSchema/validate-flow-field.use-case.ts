// import { Injectable } from '@nestjs/common';
// import { WsException } from '@nestjs/websockets';
// import jsonata from 'jsonata';

// import { InputSchema } from 'src/core/schemas/flow-input.schema';
// import { Field, Group, YamlSchema } from 'src/core/schemas/flow.schema';
// import { stringify } from 'yaml';

// export interface ValidadeFlowUseCaseRequest {
//   schema: YamlSchema;
//   input: InputSchema;
// }

// @Injectable()
// export class ValidadeFieldRulesUseCase {
//   async validateGroupRules(group: Group, data: unknown) {
//     if (!group.rules) return;
//     for (const rule of group.rules) {
//       const result = !!(await jsonata(rule.condition).evaluate(data));
//       if (!result) throw new WsException(rule.error);
//     }
//   }

//   async validateSchemaRules(schema: YamlSchema, data: unknown) {
//     if (!schema.rules) return;

//     for (const rule of schema.rules) {
//       const result = !!(await jsonata(rule.condition).evaluate(data));
//       if (!result) throw new WsException(rule.error);
//     }
//   }

//   collectFields(fieldsObj: Record<string, Field>): Field[] {
//     const result: Field[] = [];
//     for (const fieldKey in fieldsObj) {
//       const field = fieldsObj[fieldKey];
//       result.push(field);
//       // Se o field tem fields aninhados, coleta também
//       if (field.fields) {
//         result.push(...this.collectFields(field.fields));
//       }
//     }
//     return result;
//   }

//   getAllFieldsFromData(data: {
//     groups: Record<string, { fields: Record<string, Field> }>;
//   }) {
//     const allFields: Field[] = [];
//     for (const groupKey in data.groups) {
//       const group = data.groups[groupKey];
//       allFields.push(...this.collectFields(group.fields));
//     }
//     return allFields;
//   }

//   toYamlObject(data: unknown) {
//     const fields = this.getAllFieldsFromData(data);

//     const yamlString = stringify(fields);

//     return yamlString;
//   }

//   async execute(field: Field, data: any) {
//     if (!field.rules) return;

//     for (const rule of field.rules) {
//       const result = !!(await jsonata(rule.condition).evaluate(data));
//       if (!result) throw new WsException(rule.error);
//     }

//     return data;
//   }
// }
