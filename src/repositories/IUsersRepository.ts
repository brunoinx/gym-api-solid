import { Prisma } from '@prisma/client';

export interface IUsersRepository {
  create(data: Prisma.UserCreateInput): Promise<Prisma.UserCreateInput | null>;
  findByEmail(email: string): Promise<Prisma.UserCreateInput | null>;
}
