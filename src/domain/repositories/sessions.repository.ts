import { Prisma, Session } from 'generated/prisma';

export abstract class SessionsRepository {
  abstract findByToken(sessionId: string): Promise<Session | null>;
  abstract createUserSession: (
    data: Prisma.SessionUncheckedCreateInput,
  ) => Promise<Session>;
  abstract clearUserSessionByToken: (sessionToken: string) => Promise<void>;
  abstract cleanAllUserSessions: (userId: string) => Promise<void>;
}
