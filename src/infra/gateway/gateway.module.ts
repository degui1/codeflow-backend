import { Module } from '@nestjs/common';

import { GetFlowSchemaUseCase } from 'src/domain/use-cases/flow/get-flow-schema.use-case';
import { CreateFlowUseCase } from 'src/domain/use-cases/flow/create-flow.use-case';
import { SetFlowInputUseCase } from 'src/domain/use-cases/flow/set-flow-input.use-case';
import { CreateFlowFileUseCase } from 'src/domain/use-cases/flow/create-flow-file.use-case';

import { AuthModule } from '../auth/auth.module';
import { DatabaseModule } from '../database/database.module';
import { LanguageExpressionModule } from '../language-expression/language-expression.module';
import { YamlModule } from '../yaml/yaml.module';
import { FlowGateway } from './gateways/flow.gateway';
import { EnvModule } from '../env/env.module';

@Module({
  imports: [
    DatabaseModule,
    AuthModule,
    YamlModule,
    LanguageExpressionModule,
    EnvModule,
  ],
  providers: [
    FlowGateway,
    GetFlowSchemaUseCase,
    CreateFlowUseCase,
    SetFlowInputUseCase,
    CreateFlowFileUseCase,
  ],
})
export class GatewayModule {}
