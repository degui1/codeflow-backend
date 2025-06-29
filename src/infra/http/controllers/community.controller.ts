import { Controller, Get, Query } from '@nestjs/common';

import { GetCommunityPostsUseCase } from 'src/domain/use-cases/community/get-community-posts.use-case';

import { Page, pageSchema } from '../schemas/page.schema';
import { ZodValidationPipe } from '../pipes/zod-validation.pipe';

@Controller('community')
export class CommunityController {
  constructor(private getCommunityPostsUseCase: GetCommunityPostsUseCase) {}

  @Get()
  async getCommunityPosts(
    @Query('page', new ZodValidationPipe(pageSchema)) page: Page,
  ) {
    const { posts } = await this.getCommunityPostsUseCase.execute({ page });

    return { posts };
  }
}
