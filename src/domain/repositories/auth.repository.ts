import {
  Account,
  Prisma,
  PrismaClient,
  Provider,
  Session,
  User,
} from 'generated/prisma';
import { DefaultArgs } from 'generated/prisma/runtime/library';

export type RegisterUserInput = {
  email: string;
  name: string;
  username: string;
  oauthUserId: string;
  accessToken: string;
  tokenType: string;
  sessionToken: string;
  sessionExpires: Date;
  image: string;
  provider: keyof typeof Provider;
};

export type Transaction = Omit<
  PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
  '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'
>;

type CreateUserFn = (
  data: Prisma.UserUncheckedCreateInput,
  tx: Transaction,
) => Promise<User>;
type CreateAccountFn = (
  data: Prisma.AccountUncheckedCreateInput,
  tx: Transaction,
) => Promise<Account>;
type CreateSessionFn = (
  data: Prisma.SessionUncheckedCreateInput,
  tx: Transaction,
) => Promise<Session>;

export type RegisterUserProps = {
  data: RegisterUserInput;
  createUserFn: CreateUserFn;
  createAccountFn: CreateAccountFn;
  createSessionFn: CreateSessionFn;
};

export abstract class AuthRepository {
  abstract registerUser(
    props: RegisterUserProps,
  ): Promise<[User, Account, Session]>;
}
