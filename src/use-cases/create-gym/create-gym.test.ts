import { expect, describe, it, beforeEach } from 'vitest';
import { InMemoryGymsRepository } from 'repositories/in-memory/in-memory-gyms-repository';
import { CreateGymUseCase } from '.';

let gymsRepository: InMemoryGymsRepository;
let sut: CreateGymUseCase;

describe('Create Gym Use Case', () => {
  beforeEach(() => {
    gymsRepository = new InMemoryGymsRepository();
    sut = new CreateGymUseCase(gymsRepository);
  });

  it('should be able to create gym', async () => {
    const { gym } = await sut.execute({
      name: 'Gym 01 Teste',
      description: null,
      phone: null,
      latitude: -1.440044,
      longitude: -48.463584,
    });

    expect(gym.id).toEqual(expect.any(String));
  });
});
