import { beforeEach, describe, expect, it } from 'vitest';
import { hash } from 'bcryptjs';

import { AuthenticateUseCase } from '.';
import { InMemoryUsersRepository } from 'repositories/in-memory/in-memory-users-repository';
import { InvalidCredentialsError } from 'errors/invalid-credentials';

let usersRepository: InMemoryUsersRepository;
let sut: AuthenticateUseCase;

describe('Authenticate Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    sut = new AuthenticateUseCase(usersRepository);
  });

  it('should be able to authenticate', async () => {
    await usersRepository.create({
      name: 'John Doe',
      email: 'john.doe@mail.com',
      password_hash: await hash('123456', 6),
    });

    const { user } = await sut.execute({
      email: 'john.doe@mail.com',
      password: '123456',
    });

    expect(user.id).toEqual(expect.any(String));
  });

  it('should not be able to authenticate with wrong email', async () => {
    await usersRepository.create({
      name: 'John Doe',
      email: 'john.doe@mail.com',
      password_hash: await hash('123456', 6),
    });

    await expect(() => {
      return sut.execute({
        email: 'wrong.email@mail.com',
        password: '123456',
      });
    }).rejects.toBeInstanceOf(InvalidCredentialsError);
  });

  it('should not be able to authenticate with wrong password', async () => {
    await usersRepository.create({
      name: 'John Doe',
      email: 'john.doe@mail.com',
      password_hash: await hash('123456', 6),
    });

    await expect(() => {
      return sut.execute({
        email: 'john.doe@mail.com',
        password: '123123',
      });
    }).rejects.toBeInstanceOf(InvalidCredentialsError);
  });
});
