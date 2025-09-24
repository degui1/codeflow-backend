import { Flow, Post, Prisma } from 'generated/prisma';

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

export type UpdatePostById = {
  postId: string;
  userId?: string;
  flowId: string;
  post?: Prisma.PostUncheckedUpdateInput;
  flow?: Prisma.FlowUncheckedUpdateInput;
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
  abstract findUserPostById(
    postId: string,
    userId: string,
  ): Promise<Post | null>;
  abstract create(
    data: Omit<Prisma.PostUncheckedCreateInput, 'flowId'>,
    flow: Prisma.FlowUncheckedCreateInput,
  ): Promise<[Flow, Post]>;
  abstract getSummaryByUserId(
    userId: string,
  ): Promise<{ flows: number; likes: number }>;
  abstract deleteById(postId: string): Promise<void>;
  abstract updatePostById(data: UpdatePostById): Promise<void>;
  abstract findById(postId: string): Promise<Post | null>;
}
