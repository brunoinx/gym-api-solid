import { User } from '@prisma/client';

export interface RegisterUserCaseRequest {
  name: string;
  email: string;
  password: string;
}

export interface RegisterUseCaseResponse {
  user: User;
}
