import { CheckIn } from '@prisma/client';
import { MaxDistanceError } from 'errors/max-distance-error';
import { MaxNumberOfCheckInsError } from 'errors/max-number-of-checkIns';
import { PermissionsInvalidError } from 'errors/permissions-invalid';
import { ResourceNotFoundError } from 'errors/resource-not-found';
import { ICheckInsRepository } from 'repositories/interfaces/check-ins-repository-interface';
import { IGymsRepository } from 'repositories/interfaces/gyms-repository-interface';
import { IUsersRepository } from 'repositories/interfaces/users-repository-interface';
import { getDistanceBetweenCoordinates } from 'utils/get-distance-between-coordinates';

const MAX_DISTANCE_IN_KM = 0.1; // 100m

interface CheckInsUseCaseRequest {
  userId: string;
  gymId: string;
  userLatitude: number;
  userLongitude: number;
}

interface CheckInsUseCaseResponse {
  checkIn: CheckIn;
}

export class CheckInsUseCase {
  constructor(
    private checkInsRepository: ICheckInsRepository,
    private gymsRepository: IGymsRepository,
    private usersRepository: IUsersRepository,
  ) {}

  async execute({
    userId,
    gymId,
    userLatitude,
    userLongitude,
  }: CheckInsUseCaseRequest): Promise<CheckInsUseCaseResponse> {
    const user = await this.usersRepository.findById(userId);
    const gym = await this.gymsRepository.findById(gymId);
    const checkInOnSameDate = await this.checkInsRepository.findByUserIdOnDate(userId, new Date());

    if (!gym) {
      throw new ResourceNotFoundError();
    }

    const distance = getDistanceBetweenCoordinates(
      { latitude: userLatitude, longitude: userLongitude },
      { latitude: gym.latitude.toNumber(), longitude: gym.longitude.toNumber() },
    );

    if (distance > MAX_DISTANCE_IN_KM) {
      throw new MaxDistanceError();
    }

    if (checkInOnSameDate) {
      throw new MaxNumberOfCheckInsError();
    }

    if (user?.role === 'ADMIN') {
      throw new PermissionsInvalidError();
    }

    const checkIn = await this.checkInsRepository.create({
      user_id: userId,
      gym_id: gymId,
    });

    return { checkIn };
  }
}
