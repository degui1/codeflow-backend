import { Injectable, NotFoundException } from '@nestjs/common';

import { UsersRepository } from '../../repositories/users.repository';
import { PostsRepository } from 'src/domain/repositories/posts.repository';

export interface GetUserSummaryUseCaseRequest {
  userId: string;
}

export interface GetUserSummaryUseCaseResponse {
  likes: number;
  flows: number;
  downloads: number;
}

@Injectable()
export class GetUserSummaryUseCase {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly postsRepository: PostsRepository,
  ) {}

  async execute({
    userId,
  }: GetUserSummaryUseCaseRequest): Promise<GetUserSummaryUseCaseResponse> {
    const user = await this.usersRepository.findById(userId);

    if (!user) {
      throw new NotFoundException();
    }

    const { flows, likes, downloads } =
      await this.postsRepository.getSummaryByUserId(userId);

    return {
      likes,
      flows,
      downloads,
    };
  }
}
