import { CheckIn } from '@prisma/client';
import { ICheckInsRepository } from 'repositories/interfaces/check-ins-repository-interface';

interface FetchUserHistoryUseCaseRequest {
  userId: string;
  page: number;
}

interface FetchUserHistoryUseCaseResponse {
  checkIns: CheckIn[];
}

export class FetchUserCheckInsHistoryUseCase {
  constructor(private checkInsRepository: ICheckInsRepository) {}

  async execute({
    userId,
    page,
  }: FetchUserHistoryUseCaseRequest): Promise<FetchUserHistoryUseCaseResponse> {
    const checkIns = await this.checkInsRepository.findManyByUserId(userId, page);

    return { checkIns };
  }
}
