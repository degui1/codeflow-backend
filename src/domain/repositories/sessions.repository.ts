import { Prisma, Session, Provider } from 'generated/prisma';

export type RegisterUserInput = {
  email: string;
  name: string;
  username: string;
  oauthUserId: string;
  accessToken: string;
  tokenType: string;
  sessionToken: string;
  sessionExpires: Date;
  provider: keyof typeof Provider;
};

export abstract class SessionsRepository {
  abstract findByToken(sessionId: string): Promise<Session | null>;
  abstract registerUser(data: RegisterUserInput): Promise<void>;
  abstract createUserSession: (
    data: Prisma.SessionUncheckedCreateInput,
  ) => Promise<Session>;
  abstract clearUserSessionByToken: (sessionToken: string) => Promise<Session>;
  abstract cleanAllUserSessions: (userId: string) => Promise<void>;
}
