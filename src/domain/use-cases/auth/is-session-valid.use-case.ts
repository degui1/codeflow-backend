import { Injectable } from '@nestjs/common';

import { SessionsRepository } from '../../repositories/sessions.repository';

interface IsSessionValidUSeCaseRequest {
  sessionToken: string;
}

interface IsSessionValidUSeCaseResponse {
  isAuthenticated: boolean;
}

@Injectable()
export class IsSessionValidUseCase {
  constructor(private readonly sessionsRepository: SessionsRepository) {}

  async execute({
    sessionToken,
  }: IsSessionValidUSeCaseRequest): Promise<IsSessionValidUSeCaseResponse> {
    const session = await this.sessionsRepository.findByToken(sessionToken);

    if (!session) {
      return { isAuthenticated: false };
    }

    const isExpired = session.expires.getTime() < Date.now();

    if (isExpired) {
      return { isAuthenticated: false };
    }

    return {
      isAuthenticated: true,
    };
  }
}
