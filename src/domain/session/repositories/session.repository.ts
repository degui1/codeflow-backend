import { Session, Prisma } from 'generated/prisma';

export interface SessionsRepository {
  findBySessionToken: (sessionId: string) => Promise<Session | null>;
  create: (data: Prisma.SessionUncheckedCreateInput) => Promise<Session>;
  delete: (session: Session) => Promise<void>;
  updateExpiresTime(
    sessionToken: string,
    expires: string | Date,
  ): Promise<Session>;
}
