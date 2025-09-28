import { hash } from 'bcryptjs';
import { User } from '@prisma/client';
import { IUsersRepository } from 'repositories/interfaces/IUsersRepository';
import { UserAlreadyExistsError } from 'errors/user-already-exists';

interface RegisterUserCaseRequest {
  name: string;
  email: string;
  password: string;
}

interface RegisterUseCaseResponse {
  user: User;
}

/**
 * Implement Dependency Inversion Principle - SOLID
 * Dependency Inversion Principle: High-level modules should not depend on low-level modules. Both should depend on abstractions.
 * Class receive dependency (usersRepository) through constructor.
 */
export class RegisterUseCase {
  constructor(private usersRepository: IUsersRepository) {}

  async execute(data: RegisterUserCaseRequest): Promise<RegisterUseCaseResponse> {
    const { name, email, password } = data;
    const password_hash = await hash(password, 6);

    const userWithSameEmail = await this.usersRepository.findByEmail(email);

    if (userWithSameEmail) {
      throw new UserAlreadyExistsError();
    }

    const user = await this.usersRepository.create({
      name,
      email,
      password_hash,
    });

    return { user };
  }
}
