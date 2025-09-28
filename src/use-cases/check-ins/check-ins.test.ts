import { describe, expect, it, beforeEach, vi, afterEach } from 'vitest';

import { InMemoryCheckInsRepository } from 'repositories/in-memory/check-ins-repository';
import { CheckInsUseCase } from '.';
import { InMemoryUsersRepository } from 'repositories/in-memory/users-repository';
import { hash } from 'bcryptjs';
import { PermissionsInvalidError } from 'errors/permissions-invalid';

let usersRepository: InMemoryUsersRepository;
let checkInsRepository: InMemoryCheckInsRepository;
let sut: CheckInsUseCase;

describe('Check-in Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    checkInsRepository = new InMemoryCheckInsRepository();
    sut = new CheckInsUseCase(checkInsRepository, usersRepository);

    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should be able to check in', async () => {
    const createdCheckIn = await sut.execute({
      userId: 'user-01',
      gymId: 'gym-01',
    });

    expect(createdCheckIn.checkIn.id).toEqual(expect.any(String));
  });

  it('should not be able to check in twice in the same day', async () => {
    const date = new Date(2025, 2, 20, 10, 0, 0);
    vi.setSystemTime(date);

    await sut.execute({
      userId: 'user-01',
      gymId: 'gym-01',
    });

    await expect(() => {
      return sut.execute({
        userId: 'user-01',
        gymId: 'gym-01',
      });
    }).rejects.toBeInstanceOf(Error);
  });

  it('should be able to check in twice but in different days', async () => {
    const date = new Date(2025, 2, 20, 10, 0, 0);
    vi.setSystemTime(date);

    sut.execute({
      userId: 'user-01',
      gymId: 'gym-01',
    });

    const date2 = new Date(2025, 2, 21, 10, 0, 0);
    vi.setSystemTime(date2);

    const { checkIn } = await sut.execute({
      userId: 'user-01',
      gymId: 'gym-01',
    });

    expect(checkIn.id).toEqual(expect.any(String));
  });

  it('should not be able to check for ADMIN Role users', async () => {
    const createdUser = await usersRepository.create({
      name: 'John Doe',
      email: 'john.doe@mail.com',
      password_hash: await hash('123456', 6),
      role: 'ADMIN',
    });

    await expect(() => {
      return sut.execute({
        userId: createdUser.id,
        gymId: 'gym-01',
      });
    }).rejects.toBeInstanceOf(PermissionsInvalidError);
  });

  it.todo('should be validate check-in only for ADMIN Role users', () => {});
});
