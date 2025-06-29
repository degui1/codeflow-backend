import { Post } from 'generated/prisma';

export interface PostWithLike extends Post {
  _count: {
    Like: number;
  };
}

export type PublicPost = Omit<PostWithLike, 'id' | 'user_id'>;

export abstract class PostsRepository {
  abstract findManyPublicByUserId(
    userId: string,
    page: number,
  ): Promise<PublicPost[]>;
  abstract findManyByUserId(
    userId: string,
    page: number,
  ): Promise<PostWithLike[]>;
  abstract findManyPublic(page: number): Promise<PublicPost[]>;
}
