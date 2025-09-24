import { z } from 'zod';
import {
  Body,
  Controller,
  Delete,
  HttpCode,
  Patch,
  Post,
  Put,
} from '@nestjs/common';

import { CreatePostsUseCase } from 'src/domain/use-cases/post/create-post.use-case';

import { ZodValidationPipe } from '../pipes/zod-validation.pipe';
import { UserId } from '../decorators/user.decorator';
import { DeletePostsUseCase } from 'src/domain/use-cases/post/delete-post.use-case';
import { UpdatePostsUseCase } from 'src/domain/use-cases/post/update-post.use-case';
import { IncreaseDownloadPostUseCase } from 'src/domain/use-cases/post/increase-download-post.use-case';
import { ToggleLikeUseCase } from 'src/domain/use-cases/post/toggle-like.use-case';

const createPostSchema = z.object({
  title: z.string(),
  description: z.string().default(''),
  flowSchemaId: z.string().uuid(),
  content: z.string(),
  visibility: z.enum(['PUBLIC', 'PRIVATE']),
});

type CreatePost = z.infer<typeof createPostSchema>;

const updatePostSchema = z.object({
  id: z.string().uuid(),
  title: z.string().optional(),
  description: z.string().optional(),
  content: z.string().optional(),
  visibility: z.enum(['PUBLIC', 'PRIVATE']).optional(),
});

type UpdatePost = z.infer<typeof updatePostSchema>;

const deletePostSchema = z.object({
  id: z.string().uuid(),
});

type DeletePost = z.infer<typeof deletePostSchema>;

const downloadPostSchema = z.object({
  id: z.string().uuid(),
});

type DownloadPost = z.infer<typeof downloadPostSchema>;

const toggleLikeSchema = z.object({
  id: z.string().uuid(),
});

type ToggleLike = z.infer<typeof toggleLikeSchema>;

@Controller('posts')
export class PostsController {
  constructor(
    private readonly createPosts: CreatePostsUseCase,
    private readonly deletePosts: DeletePostsUseCase,
    private readonly updatePosts: UpdatePostsUseCase,
    private readonly increaseDownloadPost: IncreaseDownloadPostUseCase,
    private readonly toggleLikeUseCase: ToggleLikeUseCase,
  ) {}

  @Post()
  @HttpCode(201)
  async create(
    @UserId() userId: string,
    @Body(new ZodValidationPipe(createPostSchema)) body: CreatePost,
  ) {
    await this.createPosts.execute({
      userId,
      content: body.content,
      description: body.description,
      flowSchemaId: body.flowSchemaId,
      title: body.title,
      visibility: body.visibility,
    });
  }

  @Patch()
  @HttpCode(204)
  async updatePost(
    @UserId() userId: string,
    @Body(new ZodValidationPipe(updatePostSchema)) body: UpdatePost,
  ) {
    await this.updatePosts.execute({
      userId,
      content: body.content,
      description: body.description,
      title: body.title,
      visibility: body.visibility,
      postId: body.id,
    });
  }

  @Delete()
  @HttpCode(204)
  async deletePost(
    @UserId() userId: string,
    @Body(new ZodValidationPipe(deletePostSchema)) body: DeletePost,
  ) {
    await this.deletePosts.execute({
      userId,
      postId: body.id,
    });
  }

  @Put('download')
  @HttpCode(204)
  async increaseDownloadCount(
    @Body(new ZodValidationPipe(downloadPostSchema)) body: DownloadPost,
  ) {
    await this.increaseDownloadPost.execute({ postId: body.id });
  }

  @Put('like')
  @HttpCode(204)
  async toggleLike(
    @UserId() userId: string,
    @Body(new ZodValidationPipe(toggleLikeSchema)) body: ToggleLike,
  ) {
    await this.toggleLikeUseCase.execute({ postId: body.id, userId });
  }
}
