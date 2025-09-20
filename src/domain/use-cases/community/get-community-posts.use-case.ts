import { Injectable } from '@nestjs/common';

import {
  PostsRepository,
  PublicPost,
} from '../../repositories/posts.repository';

export interface GetCommunityPostsRequest {
  page?: number;
  author?: string;
  startDate?: Date;
  endDate?: Date;
  downloads?: number;
  flowSchemaId?: string;
}

export interface GetCommunityPostsResponse {
  posts: PublicPost[];
  hasNextPage: boolean;
}

@Injectable()
export class GetCommunityPostsUseCase {
  constructor(private readonly postsRepository: PostsRepository) {}

  async execute({
    page,
    author,
    downloads,
    endDate,
    flowSchemaId,
    startDate,
  }: GetCommunityPostsRequest): Promise<GetCommunityPostsResponse> {
    const posts = await this.postsRepository.findManyPublic(page ?? 1, {
      author,
      downloads,
      endDate,
      flowSchemaId,
      startDate,
    });

    const hasNextPage = posts.length === 10;

    if (hasNextPage) {
      posts.pop();
    }

    return {
      posts: posts,
      hasNextPage,
    };
  }
}
