import { Controller, Get, Param, Query } from '@nestjs/common';

import { GetUserUseCase } from 'src/domain/use-cases/current-user/get-current-user.use-case';
import { GetProfilePostHistoryUseCase } from 'src/domain/use-cases/profile/get-profile-post-history.use-case';

import { Public } from '../decorators/public.decorator';
import { ZodValidationPipe } from '../pipes/zod-validation.pipe';
import { Page, pageSchema } from '../schemas/page.schema';

@Controller('user')
export class UserController {
  constructor(
    private readonly getUserUseCase: GetUserUseCase,
    private readonly getProfilePostHistoryUseCase: GetProfilePostHistoryUseCase,
  ) {}

  @Get(':userId')
  @Public()
  async getUser(@Param('userId') userId: string) {
    const { createdAt, image, name, username } =
      await this.getUserUseCase.execute({ userId });

    return {
      createdAt,
      image,
      name,
      username,
    };
  }

  @Get(':userId/history')
  @Public()
  async getUserPostHistory(
    @Param('userId') userId: string,
    @Query('page', new ZodValidationPipe(pageSchema)) page: Page,
  ) {
    const { posts } = await this.getProfilePostHistoryUseCase.execute({
      userId,
      page,
    });

    return { posts };
  }
}
