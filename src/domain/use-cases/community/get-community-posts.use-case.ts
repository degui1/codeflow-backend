import { Injectable } from '@nestjs/common';

import {
  PostsRepository,
  PublicPost,
} from '../../repositories/posts.repository';

export interface GetCommunityPostsRequest {
  page: number;
}

export interface GetCommunityPostsResponse {
  posts: PublicPost[];
}

@Injectable()
export class GetCommunityPostsUseCase {
  constructor(private readonly postsRepository: PostsRepository) {}

  async execute({
    page,
  }: GetCommunityPostsRequest): Promise<GetCommunityPostsResponse> {
    const posts = await this.postsRepository.findManyPublic(page ?? 1);

    return {
      posts: posts,
    };
  }
}
