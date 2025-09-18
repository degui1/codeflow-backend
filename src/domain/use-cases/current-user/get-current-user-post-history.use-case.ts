import { Injectable } from '@nestjs/common';

import {
  PostsRepository,
  PostWithLike,
} from '../../repositories/posts.repository';

export interface GetUserPostHistoryRequest {
  userId: string;
  page: number;
}

export interface GetUserPostHistoryResponse {
  posts: PostWithLike[];
  hasNextPage: boolean;
}

@Injectable()
export class GetUserPostHistoryUseCase {
  constructor(private readonly postsRepository: PostsRepository) {}

  async execute({
    userId,
    page,
  }: GetUserPostHistoryRequest): Promise<GetUserPostHistoryResponse> {
    const posts = await this.postsRepository.findManyByUserId(
      userId,
      page ?? 1,
    );

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
