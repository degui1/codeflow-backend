import { Injectable } from '@nestjs/common';

import {
  PostsRepository,
  PublicPost,
} from '../../repositories/posts.repository';

export interface GetProfilePostHistoryRequest {
  userId: string;
  page: number;
}

export interface GetProfilePostHistoryResponse {
  posts: PublicPost[];
}

@Injectable()
export class GetProfilePostHistoryUseCase {
  constructor(private readonly postsRepository: PostsRepository) {}

  async execute({
    userId,
    page,
  }: GetProfilePostHistoryRequest): Promise<GetProfilePostHistoryResponse> {
    const posts = await this.postsRepository.findManyPublicByUserId(
      userId,
      page ?? 1,
    );

    return {
      posts,
    };
  }
}
