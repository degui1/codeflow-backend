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

    return {
      posts: posts,
    };
  }
}
