import { Prisma, User } from '@prisma/client';

export type UserPublic = Prisma.UserGetPayload<{
  select: {
    id: true;
    name: true;
    email: true;
    created_at: true;
  };
}>;

export interface IUsersRepository {
  create(data: Prisma.UserCreateInput): Promise<User>;
  findByEmail(email: string): Promise<User | null>;
  findById(userId: string): Promise<UserPublic | null>;
}
