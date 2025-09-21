import { Injectable } from '@nestjs/common';

import { SessionsRepository } from '../../repositories/sessions.repository';

interface ClearSessionUSeCaseRequest {
  sessionToken: string;
}

@Injectable()
export class ClearSessionUseCase {
  constructor(private readonly sessionsRepository: SessionsRepository) {}

  async execute({ sessionToken }: ClearSessionUSeCaseRequest): Promise<void> {
    await this.sessionsRepository.clearUserSessionByToken(sessionToken);
  }
}
