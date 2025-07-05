import { Prisma, User } from 'generated/prisma';
import { Transaction } from './auth.repository';

export abstract class UsersRepository {
  abstract findById(id: string): Promise<User | null>;
  abstract findByEmail(email: string): Promise<User | null>;
  abstract create(
    data: Prisma.UserUncheckedCreateInput,
    tx?: Transaction,
  ): Promise<User>;
  abstract delete(userId: string): Promise<void>;
}
