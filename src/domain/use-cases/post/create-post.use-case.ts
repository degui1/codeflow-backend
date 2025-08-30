import { BadRequestException, Injectable } from '@nestjs/common';

import { PostsRepository } from '../../repositories/posts.repository';
import { UsersRepository } from 'src/domain/repositories/users.repository';
import { FlowSchemasRepository } from 'src/domain/repositories/flow-schemas.repository';

export interface CreatePostsRequest {
  userId: string;
  title: string;
  description: string;
  flowSchemaId: string;
  content: string;
}

@Injectable()
export class CreatePostsUseCase {
  constructor(
    private readonly postsRepository: PostsRepository,
    private readonly usersRepository: UsersRepository,
    private readonly flowSchemasRepository: FlowSchemasRepository,
  ) {}

  async execute({
    title,
    description,
    userId,
    content,
    flowSchemaId,
  }: CreatePostsRequest): Promise<void> {
    const user = await this.usersRepository.findById(userId);

    if (!user) {
      throw new BadRequestException();
    }

    const flowSchema = await this.flowSchemasRepository.findById(flowSchemaId);

    if (!flowSchema) {
      throw new BadRequestException();
    }

    await this.postsRepository.create(
      {
        user_id: userId,
        title,
        description,
      },
      {
        flowSchemaId,
        content,
      },
    );
  }
}
