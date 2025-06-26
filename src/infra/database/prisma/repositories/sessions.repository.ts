import { Injectable } from '@nestjs/common';
import { Prisma } from 'generated/prisma';
import { SessionsRepository } from 'src/domain/repositories/sessions.repository';
import { PrismaService } from 'src/infra/database/prisma/prisma.service';

@Injectable()
export class PrismaSessionsRepository implements SessionsRepository {
  constructor(private readonly prismaService: PrismaService) {}

  findByToken(sessionToken: string) {
    return this.prismaService.session.findUnique({
      where: { session_token: sessionToken },
    });
  }

  async createUserSession({
    session_token,
    expires,
    user_id,
  }: Prisma.SessionUncheckedCreateInput) {
    const session = await this.prismaService.session.create({
      data: {
        session_token,
        expires,
        user_id,
      },
    });

    return session;
  }

  async updateSessionExpiration(sessionToken: string, newExpires: Date) {
    const session = await this.prismaService.session.update({
      data: {
        expires: newExpires,
      },
      where: { session_token: sessionToken },
    });

    return session;
  }

  async clearUserSessionByToken(sessionToken: string) {
    await this.prismaService.session.delete({
      where: { session_token: sessionToken },
    });
  }

  async cleanAllUserSessions(userId: string) {
    await this.prismaService.session.deleteMany({
      where: { user_id: userId },
    });
  }
}
