import { Gym } from '@prisma/client';
import { IGymsRepository } from 'repositories/interfaces/gyms-repository-interface';

type CreateGymUseCaseRequest = {
  name: string;
  description: string | null;
  phone: string | null;
  latitude: number;
  longitude: number;
};

interface CreateGymUseCaseResponse {
  gym: Gym;
}

export class CreateGymUseCase {
  constructor(private gymsRepository: IGymsRepository) {}

  async execute({
    name,
    description,
    phone,
    latitude,
    longitude,
  }: CreateGymUseCaseRequest): Promise<CreateGymUseCaseResponse> {
    const gym = await this.gymsRepository.create({
      name,
      description,
      phone,
      latitude,
      longitude,
    });

    return { gym };
  }
}
