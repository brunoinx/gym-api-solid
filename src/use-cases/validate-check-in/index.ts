import { CheckIn } from '@prisma/client';
import dayjs from 'dayjs';
import { LateCheckInValidationError } from 'errors/late-check-in-validation-error';
import { ResourceNotFoundError } from 'errors/resource-not-found';
import { ICheckInsRepository } from 'repositories/interfaces/check-ins-repository-interface';
import { IUsersRepository } from 'repositories/interfaces/users-repository-interface';

interface ValidateCheckInUseCaseRequest {
  checkInId: string;
}

interface ValidateCheckInUseCaseResponse {
  checkIn: CheckIn;
}

export class ValidateCheckInUseCase {
  constructor(
    private checkInsRepository: ICheckInsRepository,
    private usersRepository: IUsersRepository,
  ) {}

  async execute({
    checkInId,
  }: ValidateCheckInUseCaseRequest): Promise<ValidateCheckInUseCaseResponse> {
    const checkIn = await this.checkInsRepository.findById(checkInId);

    if (!checkIn) {
      throw new ResourceNotFoundError();
    }

    const distanceInMinutesFromCheckInCreation = dayjs(new Date()).diff(
      checkIn.createdAt,
      'minutes',
    );

    if (distanceInMinutesFromCheckInCreation > 20) {
      throw new LateCheckInValidationError();
    }

    checkIn.validated_at = new Date();

    await this.checkInsRepository.save(checkIn);

    return {
      checkIn,
    };
  }
}
