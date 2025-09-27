import { Prisma, User } from '@prisma/client';
import { IUsersRepository } from './IUsersRepository';

export class InMemoryUsersRepository implements IUsersRepository {
  public items: User[] = [];

  async create(data: Prisma.UserCreateInput) {
    const user = {
      id: '1',
      name: data.name,
      email: data.email,
      password_hash: data.password_hash,
      created_at: new Date(),
    };

    this.items.push(user);
    return user;
  }

  async findByEmail(email: string) {
    const user = this.items.find(item => item.email === email);

    if (!user) {
      return null;
    }

    return user;
  }

  async findById(userId: string) {
    const user = this.items.find(item => item.id === userId);

    if (!user) {
      return null;
    }

    const { id, name, email, created_at } = user;
    return { id, name, email, created_at };
  }
}
