import { Like, Prisma } from 'generated/prisma';

export abstract class LikesRepository {
  abstract findUserLikeByPostId(
    postId: string,
    userId: string,
  ): Promise<Like | null>;
  abstract create(data: Prisma.LikeUncheckedCreateInput): Promise<Like>;
  abstract delete(userId: string, postId: string): Promise<void>;
}
