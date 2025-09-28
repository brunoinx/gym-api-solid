import { describe, expect, it, beforeEach } from 'vitest';
import { compare } from 'bcryptjs';

import { RegisterUseCase } from '.';

import { InMemoryUsersRepository } from 'repositories/in-memory/users-repository';
import { UserAlreadyExistsError } from 'errors/user-already-exists';

const userRegisterData = {
  name: 'John Doe',
  email: 'john.doe@mail.com',
  password: '123456',
};

let usersRepository: InMemoryUsersRepository;
let sut: RegisterUseCase;

describe('Register Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    sut = new RegisterUseCase(usersRepository);
  });

  it('should be able to register', async () => {
    const { user } = await sut.execute(userRegisterData);

    expect(user.id).toEqual(expect.any(String));
  });

  it('should hash user password upon registration', async () => {
    const { user } = await sut.execute(userRegisterData);

    const isPasswordCorrectlyHashed = await compare('123456', user.password_hash);

    expect(isPasswordCorrectlyHashed).toBe(true);
  });

  it('should not be able to register with same email', async () => {
    await sut.execute(userRegisterData);

    await expect(() => {
      return sut.execute(userRegisterData);
    }).rejects.toBeInstanceOf(UserAlreadyExistsError);
  });
});
