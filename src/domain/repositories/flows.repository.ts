import { Flow } from 'generated/prisma';

export abstract class FlowsRepository {
  abstract findById(id: string): Promise<Flow | null>;
}
