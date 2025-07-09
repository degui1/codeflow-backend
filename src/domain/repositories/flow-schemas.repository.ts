import { FlowSchema } from 'generated/prisma';

export abstract class FlowSchemasRepository {
  abstract findById(id: string): Promise<FlowSchema | null>;
}
