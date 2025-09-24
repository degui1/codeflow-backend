import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';

import { PostsRepository } from '../../repositories/posts.repository';
import { UsersRepository } from 'src/domain/repositories/users.repository';

export interface DeletePostsRequest {
  userId: string;
  postId: string;
}

@Injectable()
export class DeletePostsUseCase {
  constructor(
    private readonly postsRepository: PostsRepository,
    private readonly usersRepository: UsersRepository,
  ) {}

  async execute({ userId, postId }: DeletePostsRequest): Promise<void> {
    const user = await this.usersRepository.findById(userId);

    if (!user) {
      throw new ForbiddenException();
    }

    const post = await this.postsRepository.findUserPostById(postId, userId);

    if (!post) {
      throw new BadRequestException();
    }

    await this.postsRepository.deleteById(postId);
  }
}
