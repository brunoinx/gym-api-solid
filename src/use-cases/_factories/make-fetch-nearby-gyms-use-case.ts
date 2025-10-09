import { PrismaGymsRepository } from 'repositories/prisma/gyms.repository';
import { FetchNearbyGymsUseCase } from 'use-cases/gyms/fetch-nearby-gyms';

export function makeFetchNearbyGymsUseCase() {
  const gymsRepository = new PrismaGymsRepository();
  const useCase = new FetchNearbyGymsUseCase(gymsRepository);

  return useCase;
}
