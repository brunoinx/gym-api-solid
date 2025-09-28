import { Prisma } from '@prisma/client';
import { prisma } from 'lib/prisma';
import { IGymsRepository } from 'repositories/interfaces/gyms-repository-interface';

export class GymsRepository implements IGymsRepository {
  async create(data: Prisma.GymCreateInput) {
    const gym = await prisma.gym.create({
      data,
    });

    return gym;
  }

  async findById(id: string) {
    const gym = await prisma.gym.findUnique({
      where: { id },
    });

    return gym;
  }
}
