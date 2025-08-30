import { Account, Provider, Session, User } from 'generated/prisma';

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

export type RegisterUserProps = {
  data: RegisterUserInput;
};

export abstract class AuthRepository {
  abstract registerUser(
    props: RegisterUserProps,
  ): Promise<[User, Account, Session]>;
}
