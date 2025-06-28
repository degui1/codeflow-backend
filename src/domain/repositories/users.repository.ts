import { Provider, User } from 'generated/prisma';

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

export abstract class UsersRepository {
  abstract findById(id: string): Promise<User | null>;
  abstract findByEmail(email: string): Promise<User | null>;
  abstract registerUser(data: RegisterUserInput): Promise<void>;
}
