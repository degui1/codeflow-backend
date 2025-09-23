import { Injectable } from '@nestjs/common';
import { Prisma } from 'generated/prisma';

import { FlowsRepository } from 'src/domain/repositories/flows.repository';
import {
  FindManyPublicFilters,
  PostsRepository,
} from 'src/domain/repositories/posts.repository';
import { PrismaService } from 'src/infra/database/prisma/prisma.service';

const ITEMS_PER_PAGE = 9;

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
      take: ITEMS_PER_PAGE + 1,
      skip: (page - 1) * ITEMS_PER_PAGE,
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

  async findManyPublic(page: number, filters: FindManyPublicFilters) {
    const posts = await this.prismaService.post.findMany({
      include: {
        _count: {
          select: { likes: true },
        },
        flow: { select: { content: true } },
        user: { select: { username: true } },
      },
      where: {
        visibility: 'PUBLIC',
        ...(filters?.author && {
          OR: [
            { user: { username: { contains: filters.author } } },
            { user: { name: { contains: filters.author } } },
          ],
        }),
        ...(filters?.downloads && { downloads: filters.downloads }),
        ...(filters?.flowSchemaId && {
          flow: { flowSchemaId: filters.flowSchemaId },
        }),
        ...(filters?.startDate && { created_at: { gte: filters.startDate } }),
        ...(filters?.endDate && { created_at: { lte: filters.endDate } }),
      },
      orderBy: {
        created_at: 'desc',
      },
      take: ITEMS_PER_PAGE + 1,
      skip: (page - 1) * ITEMS_PER_PAGE,
    });

    return posts;
  }

  async getSummaryByUserId(userId: string) {
    const [flows, likes] = await Promise.all([
      this.prismaService.post.count({
        where: { user_id: userId },
      }),
      this.prismaService.like.count({ where: { user_id: userId } }),
    ]);

    return {
      flows,
      likes,
    };
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
