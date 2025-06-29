import { BadRequestException, Injectable } from '@nestjs/common';

import { UsersRepository } from '../../repositories/users.repository';

export interface DeleteUserUseCaseRequest {
  userId: string;
}

@Injectable()
export class DeleteUserUseCase {
  constructor(private readonly usersRepository: UsersRepository) {}

  async execute({ userId }: DeleteUserUseCaseRequest): Promise<void> {
    const user = await this.usersRepository.findById(userId);

    if (!user) {
      throw new BadRequestException();
    }

    await this.usersRepository.delete(userId);
  }
}
