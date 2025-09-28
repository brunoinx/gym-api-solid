import { User } from '@prisma/client';
import { compare } from 'bcryptjs';

import { IUsersRepository } from 'repositories/interfaces/users-repository-interface';
import { InvalidCredentialsError } from 'errors/invalid-credentials';

interface AuthenticateUseCaseRequest {
  email: string;
  password: string;
}

interface AuthenticateUseCaseResponse {
  user: User;
}

// Aqui deve conter as regras de negócio para autenticação
export class AuthenticateUseCase {
  constructor(private usersRepository: IUsersRepository) {}

  async execute({
    email,
    password,
  }: AuthenticateUseCaseRequest): Promise<AuthenticateUseCaseResponse> {
    const user = await this.usersRepository.findByEmail(email);

    if (!user) {
      throw new InvalidCredentialsError();
    }

    const doesPasswordMatches = await compare(password, user.password_hash);

    if (!doesPasswordMatches) {
      throw new InvalidCredentialsError();
    }

    return { user };
  }
}
