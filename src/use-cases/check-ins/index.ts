import { CheckIn } from '@prisma/client';
import { PermissionsInvalidError } from 'errors/permissions-invalid';
import { ICheckInsRepository } from 'repositories/interfaces/CheckInsRepository';
import { IUsersRepository } from 'repositories/interfaces/IUsersRepository';

interface CheckInsUseCaseRequest {
  userId: string;
  gymId: string;
}

interface CheckInsUseCaseResponse {
  checkIn: CheckIn;
}

// interface ValidateCheckInUseCaseRequest {
//   checkInId: string;
//   userId: string;
// }

// interface ValidateCheckInUseCaseResponse {
//   checkIn: CheckIn;
// }

export class CheckInsUseCase {
  constructor(
    private checkInsRepository: ICheckInsRepository,
    private usersRepository: IUsersRepository,
  ) {}

  async execute({ userId, gymId }: CheckInsUseCaseRequest): Promise<CheckInsUseCaseResponse> {
    const user = await this.usersRepository.findById(userId);
    const checkInOnSameDate = await this.checkInsRepository.findByUserIdOnDate(userId, new Date());

    if (checkInOnSameDate) {
      throw new Error('Check-in already exists on this date');
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

  // implementar a validação de check-in
  // async validateCheckIn({
  //   checkInId,
  //   userId,
  // }: ValidateCheckInUseCaseRequest): Promise<ValidateCheckInUseCaseResponse> {
  //   const checkIn = await this.checkInsRepository.findById(checkInId);
  // }
}
