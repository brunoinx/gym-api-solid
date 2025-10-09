import { PrismaGymsRepository } from 'repositories/prisma/gyms.repository';
import { SearchGymsUseCase } from 'use-cases/gyms/search-gyms';

export function makeSearchGymsUseCase() {
  const gymsRepository = new PrismaGymsRepository();
  const useCase = new SearchGymsUseCase(gymsRepository);

  return useCase;
}
