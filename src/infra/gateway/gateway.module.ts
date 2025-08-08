import { Module } from '@nestjs/common';

import { GetFlowSchemaUseCase } from 'src/domain/use-cases/flowSchema/get-flow-schema.use-case';
import { CreateFlowUseCase } from 'src/domain/use-cases/flow/create-flow.use-case';
import { SetFlowInputUseCase } from 'src/domain/use-cases/flowSchema/set-flow-input.use-case';

import { AuthModule } from '../auth/auth.module';
import { DatabaseModule } from '../database/database.module';
import { LanguageExpressionModule } from '../language-expression/language-expression.module';
import { YamlModule } from '../yaml/yaml.module';
import { FlowGateway } from './gateways/flow.gateway';

@Module({
  imports: [DatabaseModule, AuthModule, YamlModule, LanguageExpressionModule],
  providers: [
    FlowGateway,
    GetFlowSchemaUseCase,
    CreateFlowUseCase,
    SetFlowInputUseCase,
  ],
})
export class GatewayModule {}
