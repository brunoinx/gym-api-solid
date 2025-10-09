import { PrismaGymsRepository } from 'repositories/prisma/gyms.repository';
import { CreateGymUseCase } from 'use-cases/gyms/create-gyms';

export function makeCreateGymUseCase() {
  const gymsRepository = new PrismaGymsRepository();
  const useCase = new CreateGymUseCase(gymsRepository);

  return useCase;
}
