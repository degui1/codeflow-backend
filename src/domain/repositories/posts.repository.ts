import { Post, Prisma } from 'generated/prisma';

export interface PostWithLike extends Post {
  _count: {
    likes: number;
  };
}

export type PublicPost = Omit<PostWithLike, 'id' | 'user_id' | 'flowId'>;

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
  abstract create(
    data: Omit<Prisma.PostUncheckedCreateInput, 'flowId'>,
    flow: Prisma.FlowUncheckedCreateInput,
  ): Promise<void>;
}
