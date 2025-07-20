// import { Injectable } from '@nestjs/common';
// import { YamlService } from 'src/infra/yaml/yaml-js/yaml.service';

// @Injectable()
// export class CreateFlowUseCase {
//   constructor(private readonly yamlService: YamlService) {}

//   async execute(request: ValidadeFlowUseCaseRequest): Promise<void> {
//     const { schema, input } = request;

//     // Validar regras do schema
//     await this.validateSchemaRules(schema, input);

//     // Coletar todos os campos do input
//     const allFields = this.getAllFieldsFromData(input);

//     // Validar regras de cada campo
//     for (const field of allFields) {
//       await this.validateFieldRules(field, input);
//     }
//   }
// }
