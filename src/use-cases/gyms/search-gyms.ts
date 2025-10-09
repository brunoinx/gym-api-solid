import { Gym } from '@prisma/client';
import { IGymsRepository } from 'repositories/interfaces/gyms-repository-interface';

type SearchGymsUseCaseRequest = {
  query: string;
  page: number;
};

interface SearchGymsUseCaseResponse {
  gyms: Gym[];
}

export class SearchGymsUseCase {
  constructor(private gymsRepository: IGymsRepository) {}

  async execute({ query, page }: SearchGymsUseCaseRequest): Promise<SearchGymsUseCaseResponse> {
    const gyms = await this.gymsRepository.searchMany(query, page);

    if (!gyms) {
      return { gyms: [] };
    }

    return { gyms };
  }
}
