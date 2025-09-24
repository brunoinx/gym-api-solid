import { describe, expect, it } from 'vitest';
import { RegisterUseCase } from './register.js';
import { compare } from 'bcryptjs';
import { InMemoryUsersRepository } from 'repositories/in-memory-users-repository.js';
import { UserAlreadyExistsError } from './errors/user-already-exists.js';

const userRegisterData = {
  name: 'John Doe',
  email: 'john.doe@mail.com',
  password: '123456',
};

describe('Register Use Case', () => {
  it('should be able to register', async () => {
    const usersRepository = new InMemoryUsersRepository();
    const registerUserCase = new RegisterUseCase(usersRepository);

    const { user } = await registerUserCase.execute(userRegisterData);

    expect(user.id).toEqual(expect.any(String));
  });

  it('should hash user password upon registration', async () => {
    const usersRepository = new InMemoryUsersRepository();
    const registerUserCase = new RegisterUseCase(usersRepository);

    const { user } = await registerUserCase.execute(userRegisterData);

    const isPasswordCorrectlyHashed = await compare('123456', user.password_hash);

    expect(isPasswordCorrectlyHashed).toBe(true);
  });

  it('should not be able to register with same email', async () => {
    const usersRepository = new InMemoryUsersRepository();
    const registerUserCase = new RegisterUseCase(usersRepository);

    await registerUserCase.execute(userRegisterData);

    await expect(() => {
      return registerUserCase.execute(userRegisterData);
    }).rejects.toBeInstanceOf(UserAlreadyExistsError);
  });
});
