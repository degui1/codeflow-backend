import { BadRequestException, Injectable } from '@nestjs/common';

import { UsersRepository } from '../../repositories/users.repository';

export interface UpdateUserUseCaseRequest {
  userId: string;
  name?: string;
  username?: string;
}

// export interface UpdateUserUseCaseResponse {}

@Injectable()
export class UpdateUserUseCase {
  constructor(private readonly usersRepository: UsersRepository) {}

  async execute({ userId }: UpdateUserUseCaseRequest): Promise<void> {
    const user = await this.usersRepository.findById(userId);

    if (!user) {
      throw new BadRequestException();
    }

    // return {
    //   email: user.email,
    //   image: user.image,
    //   username: user.username,
    //   name: user.name,
    //   createdAt: user.created_at,
    // };
  }
}
