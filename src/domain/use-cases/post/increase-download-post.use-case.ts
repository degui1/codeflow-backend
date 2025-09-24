import { BadRequestException, Injectable } from '@nestjs/common';

import { PostsRepository } from '../../repositories/posts.repository';

export interface IncreaseDownloadPostRequest {
  postId: string;
}

@Injectable()
export class IncreaseDownloadPostUseCase {
  constructor(private readonly postsRepository: PostsRepository) {}

  async execute({ postId }: IncreaseDownloadPostRequest): Promise<void> {
    const post = await this.postsRepository.findById(postId);

    if (!post) {
      throw new BadRequestException();
    }

    await this.postsRepository.updatePostById({
      postId,
      flowId: post.flowId,
      post: { downloads: post.downloads + 1 },
    });
  }
}
