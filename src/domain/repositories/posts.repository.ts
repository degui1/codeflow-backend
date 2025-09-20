import { Post, Prisma } from 'generated/prisma';

export interface PostWithLike extends Post {
  _count: {
    likes: number;
  };
}

export type PublicPost = Omit<PostWithLike, 'id' | 'user_id' | 'flowId'>;

export type FindManyPublicFilters = {
  author?: string;
  downloads?: number;
  startDate?: Date;
  endDate?: Date;
  flowSchemaId?: string;
};

export abstract class PostsRepository {
  abstract findManyPublicByUserId(
    userId: string,
    page: number,
  ): Promise<PublicPost[]>;
  abstract findManyByUserId(
    userId: string,
    page: number,
  ): Promise<PostWithLike[]>;
  abstract findManyPublic(
    page: number,
    filters: FindManyPublicFilters,
  ): Promise<PublicPost[]>;
  abstract create(
    data: Omit<Prisma.PostUncheckedCreateInput, 'flowId'>,
    flow: Prisma.FlowUncheckedCreateInput,
  ): Promise<void>;
}
