import { Controller, Get } from '@nestjs/common';

import { GetAvailableFlowSchemas } from 'src/domain/use-cases/flow/get-available-flow-schemas.use-case';

import { Public } from '../decorators/public.decorator';

@Controller('schemas')
export class FlowSchemasController {
  constructor(private getAvailableFlowSchemas: GetAvailableFlowSchemas) {}

  @Get()
  @Public()
  async getAvailableSchemas() {
    const { flowSchemas } = await this.getAvailableFlowSchemas.execute();

    return {
      flowSchemas,
    };
  }
}
