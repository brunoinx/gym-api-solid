import { PrismaCheckInsRepository } from 'repositories/prisma/check-ins.repository';
import { GetUserMetricsUseCase } from 'use-cases/get-users-metrics';

export function makeGetUserMetricsUseCase() {
  const checkInsRepository = new PrismaCheckInsRepository();
  const useCase = new GetUserMetricsUseCase(checkInsRepository);

  return useCase;
}
