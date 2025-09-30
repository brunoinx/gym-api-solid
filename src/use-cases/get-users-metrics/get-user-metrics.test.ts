import { describe, expect, it, beforeEach } from 'vitest';

import { InMemoryCheckInsRepository } from 'repositories/in-memory/in-memory-check-ins-repository';
import { GetUserMetricsUseCase } from '.';

let checkInsRepository: InMemoryCheckInsRepository;
let sut: GetUserMetricsUseCase;

describe('Get User Metrics Use Case', () => {
  beforeEach(() => {
    checkInsRepository = new InMemoryCheckInsRepository();
    sut = new GetUserMetricsUseCase(checkInsRepository);
  });

  it('should be get user metrics', async () => {
    for (let i = 1; i <= 6; i++) {
      await checkInsRepository.create({
        user_id: `user-01`,
        gym_id: `gym-${i}`,
      });
    }

    const { checkInsCount } = await sut.execute({
      userId: 'user-01',
    });

    expect(checkInsCount).toEqual(6);
  });
});
