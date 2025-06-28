import { Controller, Get } from '@nestjs/common';
import { Response } from 'express';
import { UserId } from '../decorators/user.decorator';
import { GetUserUseCase } from 'src/domain/use-cases/get-user.use-case';

@Controller('user')
export class UserController {
  constructor(private readonly getUserUseCase: GetUserUseCase) {}

  @Get()
  async getUser(@UserId() userId: string) {
    const response = await this.getUserUseCase.execute({ userId });

    return {
      response,
    };
  }
}
