import { Module } from '@nestjs/common';

import { DatabaseModule } from '../database/database.module';
import { AuthModule } from '../auth/auth.module';
import { FlowGateway } from './gateways/flow.gateway';
import { GetFlowSchemaUseCase } from 'src/domain/use-cases/flowSchema/get-flow-schema.use-case';

@Module({
  imports: [DatabaseModule, AuthModule],
  providers: [FlowGateway, GetFlowSchemaUseCase],
})
export class GatewayModule {}
