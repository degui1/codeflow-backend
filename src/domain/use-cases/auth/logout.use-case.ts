import { Injectable, UnauthorizedException } from '@nestjs/common';

import { SessionsRepository } from '../../repositories/sessions.repository';
import { UsersRepository } from '../../repositories/users.repository';

interface LogoutUseCaseResponse {
  userId: string;
}

@Injectable()
export class LogoutUseCase {
  constructor(
    private readonly sessionsRepository: SessionsRepository,
    private readonly usersRepository: UsersRepository,
  ) {}

  async execute({ userId }: LogoutUseCaseResponse): Promise<void> {
    const user = await this.usersRepository.findById(userId);

    if (!user) {
      throw new UnauthorizedException();
    }

    await this.sessionsRepository.cleanAllUserSessions(userId);
  }
}
