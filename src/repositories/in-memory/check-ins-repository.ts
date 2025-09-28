import { CheckIn, Prisma } from '@prisma/client';
import { ulid } from 'ulidx';
import { ICheckInsRepository } from 'repositories/interfaces/CheckInsRepository';
import dayjs from 'dayjs';

export class InMemoryCheckInsRepository implements ICheckInsRepository {
  public items: CheckIn[] = [];

  async create(data: Prisma.CheckInUncheckedCreateInput) {
    const checkIn: CheckIn = {
      id: ulid(),
      user_id: data.user_id,
      gym_id: data.gym_id,
      validated_at: data.validated_at ? new Date(data.validated_at) : null,
      validated_by_id: data.validated_by_id ? data.validated_by_id : null,
      createdAt: new Date(),
    };

    this.items.push(checkIn);

    return checkIn;
  }

  async findByUserIdOnDate(userId: string, date: Date) {
    const startOfTheDay = dayjs(date).startOf('date');
    const endOfTheDay = dayjs(date).endOf('date');

    const checkInInSameDate = this.items.find(checkIn => {
      const checkInDate = dayjs(checkIn.createdAt);
      const isOnSameDate = checkInDate.isAfter(startOfTheDay) && checkInDate.isBefore(endOfTheDay);

      return checkIn.user_id === userId && isOnSameDate;
    });

    if (!checkInInSameDate) {
      return null;
    }

    return checkInInSameDate;
  }
}
