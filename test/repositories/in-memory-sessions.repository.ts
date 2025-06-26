import { Session, Prisma } from 'generated/prisma';
import { SessionsRepository } from 'src/domain/repositories/sessions.repository';

export class InMemorySessionsRepository implements SessionsRepository {
  items: Session[] = [];

  findByToken(sessionId: string) {
    const session = this.items.find(
      (session) => session.session_token === sessionId,
    );

    if (!session) {
      return Promise.resolve(null);
    }

    return Promise.resolve(session);
  }

  createUserSession(data: Prisma.SessionUncheckedCreateInput) {
    const session = {
      ...data,
      created_at: new Date(),
      expires: new Date(data.expires),
      updated_at: new Date(),
    };
    this.items.push(session);

    return Promise.resolve(session);
  }

  clearUserSessionByToken(sessionToken: string) {
    const sessionIndex = this.items.findIndex(
      (session) => session.session_token == sessionToken,
    );

    this.items = this.items.splice(sessionIndex, 1);

    return Promise.resolve();
  }

  cleanAllUserSessions(userId: string) {
    this.items = this.items.filter((session) => session.user_id !== userId);

    return Promise.resolve();
  }
}
