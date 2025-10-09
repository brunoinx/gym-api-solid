import { PrismaCheckInsRepository } from 'repositories/prisma/check-ins.repository';
import { PrismaGymsRepository } from 'repositories/prisma/gyms.repository';
import { PrismaUsersRepository } from 'repositories/prisma/users.repository';
import { CheckInsUseCase } from 'use-cases/check-ins';

export function makeCheckInUseCase() {
  const checkInsRepository = new PrismaCheckInsRepository();
  const gymsRepository = new PrismaGymsRepository();
  const usersRepository = new PrismaUsersRepository();

  const useCase = new CheckInsUseCase(checkInsRepository, gymsRepository, usersRepository);

  return useCase;
}
