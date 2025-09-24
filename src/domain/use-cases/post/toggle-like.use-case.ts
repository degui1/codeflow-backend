import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';

import { UsersRepository } from 'src/domain/repositories/users.repository';
import { LikesRepository } from 'src/domain/repositories/likes.repository';
import { PostsRepository } from 'src/domain/repositories/posts.repository';

export interface ToggleLikeRequest {
  userId: string;
  postId: string;
}

@Injectable()
export class ToggleLikeUseCase {
  constructor(
    private readonly postsRepository: PostsRepository,
    private readonly usersRepository: UsersRepository,
    private readonly likesRepository: LikesRepository,
  ) {}

  async execute({ userId, postId }: ToggleLikeRequest): Promise<void> {
    const user = await this.usersRepository.findById(userId);

    if (!user) {
      throw new ForbiddenException();
    }

    const post = await this.postsRepository.findById(postId);

    if (!post) {
      throw new BadRequestException();
    }

    const like = await this.likesRepository.findUserLikeByPostId(
      postId,
      userId,
    );

    if (like) {
      await this.likesRepository.delete(userId, postId);

      return;
    }

    await this.likesRepository.create({ post_id: postId, user_id: userId });
  }
}
