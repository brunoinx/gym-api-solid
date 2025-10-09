import { PrismaCheckInsRepository } from 'repositories/prisma/check-ins.repository';
import { ValidateCheckInUseCase } from '../validate-check-in';
import { PrismaUsersRepository } from 'repositories/prisma/users.repository';

export function makeValidateCheckInUseCase() {
  const checkInsRepository = new PrismaCheckInsRepository();
  const usersRepository = new PrismaUsersRepository();

  const useCase = new ValidateCheckInUseCase(checkInsRepository, usersRepository);

  return useCase;
}
