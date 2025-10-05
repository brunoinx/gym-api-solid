import { describe, expect, it, beforeEach } from 'vitest';

import { InMemoryGymsRepository } from 'repositories/in-memory/in-memory-gyms-repository';
import { SearchGymUseCase } from './search-gyms';

let gymsRepository: InMemoryGymsRepository;
let sut: SearchGymUseCase;

describe('Search Gyms Use Case', () => {
  beforeEach(() => {
    gymsRepository = new InMemoryGymsRepository();
    sut = new SearchGymUseCase(gymsRepository);
  });

  it('should be able to search for gyms by query', async () => {
    await gymsRepository.create({
      name: 'JavaScript Gym',
      latitude: -1.440044,
      longitude: -48.463584,
    });

    await gymsRepository.create({
      name: 'TypeScript Gym',
      latitude: -1.440044,
      longitude: -48.463584,
    });

    const { gyms } = await sut.execute({
      query: 'JavaScript',
      page: 1,
    });

    expect(gyms).toHaveLength(1);
    expect(gyms).toEqual([expect.objectContaining({ name: 'JavaScript Gym' })]);
  });

  it('should be able to fetch paginated gym search', async () => {
    for (let i = 1; i <= 22; i++) {
      gymsRepository.create({
        name: `JavaScript Gym ${i}`,
        latitude: -1.440044,
        longitude: -48.463584,
      });
    }

    const { gyms } = await sut.execute({
      query: 'JavaScript',
      page: 2,
    });

    expect(gyms).toHaveLength(2);
    expect(gyms).toEqual([
      expect.objectContaining({ name: 'JavaScript Gym 21' }),
      expect.objectContaining({ name: 'JavaScript Gym 22' }),
    ]);
  });
});
