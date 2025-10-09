import { describe, expect, it, beforeEach, vi, afterEach } from 'vitest';

import { InMemoryCheckInsRepository } from 'repositories/in-memory/in-memory-check-ins-repository';
import { InMemoryUsersRepository } from 'repositories/in-memory/in-memory-users-repository';

import { ValidateCheckInUseCase } from '.';
import { ResourceNotFoundError } from 'errors/resource-not-found';
import { LateCheckInValidationError } from 'errors/late-check-in-validation-error';

let usersRepository: InMemoryUsersRepository;
let checkInsRepository: InMemoryCheckInsRepository;
let sut: ValidateCheckInUseCase;

describe('Validate Check-in Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    checkInsRepository = new InMemoryCheckInsRepository();
    sut = new ValidateCheckInUseCase(checkInsRepository, usersRepository);

    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should be able to check in', async () => {
    const createdCheckIn = await checkInsRepository.create({
      user_id: 'user-01',
      gym_id: 'gym-01',
    });

    const { checkIn } = await sut.execute({
      checkInId: createdCheckIn.id,
    });

    expect(checkIn.validated_at).toEqual(expect.any(Date));
    expect(checkInsRepository.items[0].validated_at).toEqual(expect.any(Date));
  });

  it('should not be able to validate an existent check-in', async () => {
    await expect(() =>
      sut.execute({
        checkInId: 'check-in-01',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });

  it('should not be able to validate a check-in after 20 minutes of its creation', async () => {
    vi.setSystemTime(new Date(2025, 0, 1, 13, 40));

    const createdCheckIn = await checkInsRepository.create({
      user_id: 'user-01',
      gym_id: 'gym-01',
    });

    const twentyOneMinutesInMs = 1000 * 60 * 21;

    vi.advanceTimersByTime(twentyOneMinutesInMs);

    await expect(() =>
      sut.execute({
        checkInId: createdCheckIn.id,
      }),
    ).rejects.toBeInstanceOf(LateCheckInValidationError);
  });

  it.todo('should be validate check-in only for ADMIN Role users', () => {});
});
