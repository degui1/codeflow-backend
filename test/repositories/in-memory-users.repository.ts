import { User } from 'generated/prisma';
import {
  RegisterUserInput,
  UsersRepository,
} from 'src/domain/repositories/users.repository';

export class InMemoryUsersRepository implements UsersRepository {
  items: User[] = [];

  findByEmail(email: string): Promise<User | null> {
    const user = this.items.find((user) => user.email === email);

    if (!user) {
      return Promise.resolve(null);
    }

    return Promise.resolve(user);
  }

  registerUser(data: RegisterUserInput): Promise<void> {}
}
