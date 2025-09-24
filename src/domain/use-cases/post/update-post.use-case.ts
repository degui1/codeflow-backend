import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';

import { PostsRepository } from '../../repositories/posts.repository';
import { UsersRepository } from 'src/domain/repositories/users.repository';

export interface UpdatePostsRequest {
  userId: string;
  postId: string;
  visibility?: 'PUBLIC' | 'PRIVATE';
  content?: string;
  title?: string;
  description?: string;
}

@Injectable()
export class UpdatePostsUseCase {
  constructor(
    private readonly postsRepository: PostsRepository,
    private readonly usersRepository: UsersRepository,
  ) {}

  async execute({
    userId,
    postId,
    content,
    description,
    title,
    visibility,
  }: UpdatePostsRequest): Promise<void> {
    const user = await this.usersRepository.findById(userId);

    if (!user) {
      throw new ForbiddenException();
    }

    const post = await this.postsRepository.findUserPostById(postId, userId);

    if (!post) {
      throw new BadRequestException();
    }

    await this.postsRepository.updatePostById({
      postId,
      userId,
      flowId: post.flowId,
      post: {
        title,
        description,
        visibility,
      },
      flow: { content },
    });
  }
}
