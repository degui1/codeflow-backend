import { Controller, Get, Query } from '@nestjs/common';
import { z } from 'zod';

import { GetCommunityPostsUseCase } from 'src/domain/use-cases/community/get-community-posts.use-case';

import { Page, pageSchema } from '../schemas/page.schema';
import { ZodValidationPipe } from '../pipes/zod-validation.pipe';
import { Public } from '../decorators/public.decorator';

@Controller('community')
export class CommunityController {
  constructor(private getCommunityPostsUseCase: GetCommunityPostsUseCase) {}

  @Get()
  @Public()
  async getCommunityPosts(
    @Query('page', new ZodValidationPipe(pageSchema)) page: Page,
    @Query('author', new ZodValidationPipe(z.string().optional()))
    author: string,
    @Query('startDate', new ZodValidationPipe(z.coerce.date().optional()))
    startDate: Date,
    @Query('endDate', new ZodValidationPipe(z.coerce.date().optional()))
    endDate: Date,
    @Query('flowSchemaId', new ZodValidationPipe(z.string().uuid().optional()))
    flowSchemaId: string,
    @Query('downloads', new ZodValidationPipe(z.coerce.number().optional()))
    downloads: number,
  ) {
    const { posts, hasNextPage } = await this.getCommunityPostsUseCase.execute({
      page,
      author,
      downloads,
      endDate,
      flowSchemaId,
      startDate,
    });

    return { posts, hasNextPage };
  }
}
