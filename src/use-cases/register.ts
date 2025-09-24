import { hash } from 'bcryptjs';
import { RegisterRequestBody } from 'types/register.body';
import { UserAlreadyExistsError } from './errors/user-already-exists';

/**
 * Implement Dependency Inversion Principle - SOLID
 * Dependency Inversion Principle: High-level modules should not depend on low-level modules. Both should depend on abstractions.
 * Class receive dependency (usersRepository) through constructor.
 */
export class RegisterUseCase {
  constructor(private usersRepository: any) {}

  async execute(data: RegisterRequestBody) {
    const { name, email, password } = data;
    const password_hash = await hash(password, 6);

    const userWithSameEmail = await this.usersRepository.findByEmail(email);

    if (userWithSameEmail) {
      throw new UserAlreadyExistsError();
    }

    this.usersRepository.create({
      name,
      email,
      password_hash,
    });
  }
}
