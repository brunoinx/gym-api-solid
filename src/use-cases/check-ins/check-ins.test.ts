import { describe, expect, it, beforeEach, vi, afterEach } from 'vitest';
import { hash } from 'bcryptjs';

import { InMemoryCheckInsRepository } from 'repositories/in-memory/in-memory-check-ins-repository';
import { InMemoryUsersRepository } from 'repositories/in-memory/in-memory-users-repository';
import { InMemoryGymsRepository } from 'repositories/in-memory/in-memory-gyms-repository';

import { CheckInsUseCase } from '.';
import { PermissionsInvalidError } from 'errors/permissions-invalid';
import { MaxNumberOfCheckInsError } from 'errors/max-number-of-checkIns';
import { MaxDistanceError } from 'errors/max-distance-error';

let usersRepository: InMemoryUsersRepository;
let gymsRepository: InMemoryGymsRepository;
let checkInsRepository: InMemoryCheckInsRepository;
let sut: CheckInsUseCase;

describe('Check-in Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    gymsRepository = new InMemoryGymsRepository();
    checkInsRepository = new InMemoryCheckInsRepository();
    sut = new CheckInsUseCase(checkInsRepository, gymsRepository, usersRepository);

    gymsRepository.create({
      id: 'gym-01',
      name: 'Gym 01',
      description: null,
      phone: null,
      latitude: -1.440044,
      longitude: -48.463584,
    });

    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should be able to check in', async () => {
    const { checkIn } = await sut.execute({
      userId: 'user-01',
      gymId: 'gym-01',
      userLatitude: -1.440044,
      userLongitude: -48.463584,
    });

    expect(checkIn.id).toEqual(expect.any(String));
  });

  it('should not be able to check in twice in the same day', async () => {
    const date = new Date(2025, 2, 20, 10, 0, 0);
    vi.setSystemTime(date);

    await sut.execute({
      userId: 'user-01',
      gymId: 'gym-01',
      userLatitude: -1.440044,
      userLongitude: -48.463584,
    });

    await expect(() => {
      return sut.execute({
        userId: 'user-01',
        gymId: 'gym-01',
        userLatitude: -1.440044,
        userLongitude: -48.463584,
      });
    }).rejects.toBeInstanceOf(MaxNumberOfCheckInsError);
  });

  it('should be able to check in twice but in different days', async () => {
    const date = new Date(2025, 2, 20, 10, 0, 0);
    vi.setSystemTime(date);

    sut.execute({
      userId: 'user-01',
      gymId: 'gym-01',
      userLatitude: -1.440044,
      userLongitude: -48.463584,
    });

    const date2 = new Date(2025, 2, 21, 10, 0, 0);
    vi.setSystemTime(date2);

    const { checkIn } = await sut.execute({
      userId: 'user-01',
      gymId: 'gym-01',
      userLatitude: -1.440044,
      userLongitude: -48.463584,
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
        userLatitude: -1.440044,
        userLongitude: -48.463584,
      });
    }).rejects.toBeInstanceOf(PermissionsInvalidError);
  });

  it.todo('should be validate check-in only for ADMIN Role users', () => {});

  it('should not be able to check in on distant gym', async () => {
    gymsRepository.create({
      id: 'gym-02',
      name: 'Gym 02',
      description: null,
      phone: null,
      latitude: -1.402889,
      longitude: -48.428734,
    });

    await expect(
      sut.execute({
        gymId: 'gym-02',
        userId: 'user-01',
        userLatitude: -1.440044,
        userLongitude: -48.463584,
      }),
    ).rejects.toBeInstanceOf(MaxDistanceError);
  });
});
