import { Gym, Prisma } from '@prisma/client';
import { ulid } from 'ulidx';

import { IGymsRepository } from 'repositories/interfaces/gyms-repository-interface';

export class InMemoryGymsRepository implements IGymsRepository {
  public items: Gym[] = [];

  async create(data: Prisma.GymCreateInput) {
    const gyms: Gym = {
      id: data.id ?? ulid(),
      name: data.name,
      description: data.description ?? null,
      phone: data.phone ?? null,
      latitude: new Prisma.Decimal(data.latitude.toString()),
      longitude: new Prisma.Decimal(data.longitude.toString()),
      created_at: new Date(),
    };

    this.items.push(gyms);
    return gyms;
  }

  async findById(gymId: string) {
    const gyms = this.items.find(item => item.id === gymId);

    if (!gyms) {
      return null;
    }

    return gyms;
  }
}
