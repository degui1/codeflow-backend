import { Injectable } from '@nestjs/common';

import { LikesRepository } from 'src/domain/repositories/likes.repository';

import { PrismaService } from '../prisma.service';
import { Like, Prisma } from 'generated/prisma';

@Injectable()
export class PrismaLikesRepository implements LikesRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async findUserLikeByPostId(postId: string, userId: string) {
    const like = await this.prismaService.like.findUnique({
      where: { user_id_post_id: { user_id: userId, post_id: postId } },
    });

    return like;
  }

  async create(data: Prisma.LikeUncheckedCreateInput): Promise<Like> {
    const like = await this.prismaService.like.create({
      data: { post_id: data.post_id, user_id: data.user_id },
    });

    return like;
  }
  async delete(userId: string, postId: string): Promise<void> {
    await this.prismaService.like.delete({
      where: { user_id_post_id: { post_id: postId, user_id: userId } },
    });
  }
}
