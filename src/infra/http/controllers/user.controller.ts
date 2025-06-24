import { Controller, Get, UnauthorizedException } from '@nestjs/common';
import { Response } from 'express';
import { Cookies } from '../decorators/cookies.decorator';
import { PrismaService } from 'src/infra/database/prisma/prisma.service';

const SESSION_COOKIE_KEY = 'session_cookie';

@Controller()
export class UserController {
  constructor(private readonly prismaService: PrismaService) {}

  @Get('user')
  async getUser(@Cookies(SESSION_COOKIE_KEY) sessionToken: string) {
    const session = await this.prismaService.session.findUnique({
      where: { session_token: sessionToken },
    });

    if (!session) {
      throw new UnauthorizedException();
    }

    const user = await this.prismaService.user.findUnique({
      where: {
        id: session.user_id,
      },
    });

    if (!user) {
      throw new UnauthorizedException();
    }

    return {
      email: user.email,
      createdAt: user.created_at,
      name: user.name,
    };
  }
}
