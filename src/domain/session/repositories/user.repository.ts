import { Prisma, User } from 'generated/prisma';

export interface UserRepository {
  findById: (id: string) => Promise<User>;
  create: (data: Prisma.UserCreateInput) => Promise<User>;
}
