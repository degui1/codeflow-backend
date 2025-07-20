// import { Injectable } from '@nestjs/common';
// import { InputSchema } from 'src/core/schemas/flow-input.schema';
// import { YamlSchema } from 'src/core/schemas/flow.schema';
// import { FlowSchemasRepository } from 'src/domain/repositories/flow-schemas.repository';

// export interface SetFlowInputUseCaseRequest {
//   inputs: InputSchema[];
//   schema: YamlSchema;
// }

// // export interface SetFlowInputUseCaseResponse {}

// @Injectable()
// export class SetFlowInputUseCase {
//   constructor(private readonly flowSchemasRepository: FlowSchemasRepository) {}

//   async execute({ inputs, schema }: SetFlowInputUseCaseRequest) {
//     let data: unknown;
//     for (const update of inputs) {
//       const { groupKey, fieldKey, value } = update;
//       if ('index' in update) {
//         // grupo repeatable
//         if (!data.groups[groupKey]) data.groups[groupKey] = [];
//         if (!data.groups[groupKey][update.index])
//           data.groups[groupKey][update.index] = {};
//         data.groups[groupKey][update.index][fieldKey] = value;
//       } else {
//         // grupo non‑repeatable
//         if (!data.groups[groupKey]) data.groups[groupKey] = {};
//         data.groups[groupKey][fieldKey] = value;
//       }
//     }
//     return data;
//   }
// }
