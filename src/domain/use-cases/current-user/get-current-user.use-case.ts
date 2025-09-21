import { Injectable, NotFoundException } from '@nestjs/common';

import { UsersRepository } from '../../repositories/users.repository';

export interface GetUserUseCaseRequest {
  userId: string;
}

export interface GetUserUseCaseResponse {
  email: string;
  image: string | null;
  username: string;
  name: string | null;
  createdAt: Date;
  id: string;
}

@Injectable()
export class GetUserUseCase {
  constructor(private readonly usersRepository: UsersRepository) {}

  async execute({
    userId,
  }: GetUserUseCaseRequest): Promise<GetUserUseCaseResponse> {
    const user = await this.usersRepository.findById(userId);

    if (!user) {
      throw new NotFoundException();
    }

    return {
      email: user.email,
      image: user.image,
      username: user.username,
      name: user.name,
      createdAt: user.created_at,
      id: user.id,
    };
  }
}
