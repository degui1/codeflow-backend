import { Controller, Delete, Get, HttpCode, Query } from '@nestjs/common';

import { GetUserUseCase } from 'src/domain/use-cases/current-user/get-current-user.use-case';
import { DeleteUserUseCase } from 'src/domain/use-cases/current-user/delete-current-user.use-case';
import { GetUserPostHistoryUseCase } from 'src/domain/use-cases/current-user/get-current-user-post-history.use-case';

import { UserId } from '../decorators/user.decorator';
import { ZodValidationPipe } from '../pipes/zod-validation.pipe';
import { Page, pageSchema } from '../schemas/page.schema';

@Controller('me')
export class MeController {
  constructor(
    private readonly getUserUseCase: GetUserUseCase,
    private readonly deleteUserUseCase: DeleteUserUseCase,
    private readonly getUserPostHistoryUseCase: GetUserPostHistoryUseCase,
  ) {}

  @Get()
  async getUser(@UserId() userId: string) {
    const { name, username, createdAt, email, image, id } =
      await this.getUserUseCase.execute({ userId });

    return {
      name,
      username,
      createdAt,
      email,
      image,
      id,
    };
  }

  @Delete()
  @HttpCode(204)
  async deleteUser(@UserId() userId: string) {
    await this.deleteUserUseCase.execute({ userId });
  }

  @Get('history')
  async getUserPostHistory(
    @UserId() userId: string,
    @Query('page', new ZodValidationPipe(pageSchema)) page: Page,
  ) {
    const { posts, hasNextPage } = await this.getUserPostHistoryUseCase.execute(
      {
        userId,
        page,
      },
    );

    return {
      posts,
      hasNextPage,
    };
  }
}
