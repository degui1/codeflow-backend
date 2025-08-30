import { Prisma, Session } from 'generated/prisma';

import { Transaction } from 'src/core/utils/transaction';

export abstract class SessionsRepository {
  abstract findByToken(sessionId: string): Promise<Session | null>;
  abstract createUserSession: (
    data: Prisma.SessionUncheckedCreateInput,
    tx?: Transaction,
  ) => Promise<Session>;
  abstract clearUserSessionByToken: (sessionToken: string) => Promise<void>;
  abstract cleanAllUserSessions: (userId: string) => Promise<void>;
}
