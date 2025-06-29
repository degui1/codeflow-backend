import { Injectable } from '@nestjs/common';

import { PostsRepository } from 'src/domain/repositories/posts.repository';
import { PrismaService } from 'src/infra/database/prisma/prisma.service';

@Injectable()
export class PrismaPostsRepository implements PostsRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async findManyByUserId(userId: string, page: number) {
    const posts = await this.prismaService.post.findMany({
      include: {
        _count: {
          select: { Like: true },
        },
      },
      where: {
        user_id: userId,
      },
      take: 20,
      skip: (page - 1) * 20,
    });

    return posts;
  }

  async findManyPublicByUserId(userId: string, page: number) {
    const posts = await this.prismaService.post.findMany({
      select: {
        created_at: true,
        description: true,
        downloads: true,
        title: true,
        visibility: true,
        updated_at: true,
        _count: { select: { Like: true } },
      },
      where: {
        user_id: userId,
        visibility: 'PUBLIC',
      },
      take: 20,
      skip: (page - 1) * 20,
    });

    return posts;
  }

  async findManyPublic(page: number) {
    const posts = await this.prismaService.post.findMany({
      select: {
        created_at: true,
        description: true,
        downloads: true,
        title: true,
        visibility: true,
        updated_at: true,
        _count: { select: { Like: true } },
      },
      where: {
        visibility: 'PUBLIC',
      },
      take: 20,
      skip: (page - 1) * 20,
    });

    return posts;
  }
}
