import { Injectable } from '@nestjs/common';
import { Prisma } from 'generated/prisma';

import { FlowsRepository } from 'src/domain/repositories/flows.repository';
import { PostsRepository } from 'src/domain/repositories/posts.repository';
import { PrismaService } from 'src/infra/database/prisma/prisma.service';

@Injectable()
export class PrismaPostsRepository implements PostsRepository {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly flowsRepository: FlowsRepository,
  ) {}

  async findManyByUserId(userId: string, page: number) {
    const posts = await this.prismaService.post.findMany({
      include: {
        _count: {
          select: { likes: true },
        },
        flow: { select: { content: true } },
        user: { select: { username: true } },
      },
      where: {
        user_id: userId,
      },
      orderBy: {
        created_at: 'desc',
      },
      take: 10,
      skip: (page - 1) * 10,
    });

    return posts;
  }

  async findManyPublicByUserId(userId: string, page: number) {
    const posts = await this.prismaService.post.findMany({
      select: {
        id: true,
        created_at: true,
        description: true,
        downloads: true,
        title: true,
        flow: { select: { content: true } },
        visibility: true,
        updated_at: true,
        _count: { select: { likes: true } },
        user: { select: { username: true } },
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
        _count: { select: { likes: true } },
        flow: { select: { content: true } },
        user: { select: { username: true } },
      },
      where: {
        visibility: 'PUBLIC',
      },
      take: 20,
      skip: (page - 1) * 20,
    });

    return posts;
  }

  async create(data: Prisma.PostUncheckedCreateInput) {
    await this.prismaService.$transaction(async (tx) => {
      const flow = await this.flowsRepository.create(
        {
          flowSchemaId: '',
          content: '',
        },
        tx,
      );

      const post = await tx.post.create({
        data: {
          flowId: flow.id,
          description: data.description,
          title: data.title,
          user_id: data.user_id,
        },
      });

      return [flow, post];
    });
  }
}
