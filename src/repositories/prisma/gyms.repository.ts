import { prisma } from 'lib/prisma';
import {
  FindManyNearbyParams,
  IGymsRepository,
} from 'repositories/interfaces/gyms-repository-interface';
import { getDistanceBetweenCoordinates } from 'utils/get-distance-between-coordinates';
import { Prisma } from '../../../generated/prisma/client';

export class PrismaGymsRepository implements IGymsRepository {
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

  async searchMany(query: string, page: number) {
    const gyms = await prisma.gym.findMany({
      where: {
        name: {
          contains: query,
        },
      },
      take: 20,
      skip: (page - 1) * 20,
    });

    return gyms;
  }

  // Busca os gyms no raio de 10km
  async findManyNearby({ latitude, longitude }: FindManyNearbyParams) {
    // TODO: Só funciona em MySQL ou PostgreSQL;
    // const gyms = await prisma.$queryRaw<Gym[]>`
    //   SELECT * FROM gyms
    //   WHERE ( 6371 * acos( cos( radians(${latitude}) ) * cos( radians( latitude ) ) * cos( radians( longitude ) - radians(${longitude}) ) + sin( radians(${latitude}) ) * sin( radians( latitude ) ) ) ) <= 10
    // `;

    const gyms = await prisma.gym.findMany();

    const nearbyGyms = gyms.filter(gym => {
      const distance = getDistanceBetweenCoordinates(
        { latitude, longitude },
        { latitude: gym.latitude.toNumber(), longitude: gym.longitude.toNumber() },
      );

      return distance < 10;
    });

    return nearbyGyms;
  }
}
