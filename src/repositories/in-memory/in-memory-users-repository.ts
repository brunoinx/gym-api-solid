import { Prisma, User } from '@prisma/client';
import { IUsersRepository } from '../interfaces/users-repository-interface';
import { ulid } from 'ulidx';

export class InMemoryUsersRepository implements IUsersRepository {
  public items: User[] = [];

  async create(data: Prisma.UserCreateInput) {
    const user: User = {
      id: ulid(),
      name: data.name,
      email: data.email,
      password_hash: data.password_hash,
      role: data.role || 'MEMBER',
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

    return user;
  }
}
