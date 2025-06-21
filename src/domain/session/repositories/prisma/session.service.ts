import { Injectable } from '@nestjs/common';
import { Prisma } from 'generated/prisma';
import { PrismaService } from 'src/infra/database/prisma.service';

@Injectable()
export class SessionsRepository implements SessionsRepository {
  constructor(private readonly prismaService: PrismaService) {}

  findBySessionToken(sessionToken: string) {
    return this.prismaService.session.findUnique({
      where: { session_token: sessionToken },
    });
  }

  create(data: Prisma.SessionUncheckedCreateInput) {
    return this.prismaService.session.create({
      data,
    });
  }

  updateExpiresTime(sessionToken: string, expires: string | Date) {
    return this.prismaService.session.update({
      where: { session_token: sessionToken },
      data: { expires: expires },
    });
  }

  deleteSession(sessionToken: string) {
    return this.prismaService.session.delete({
      where: { session_token: sessionToken },
    });
  }
}
