import { ulid } from 'ulidx';
import dayjs from 'dayjs';
import { ICheckInsRepository } from 'repositories/interfaces/check-ins-repository-interface';
import { CheckIn, Prisma } from '../../../generated/prisma/client';

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

  async findById(id: string) {
    const checkIn = this.items.find(item => item.id === id);

    if (!checkIn) {
      return null;
    }

    return checkIn;
  }

  async findManyByUserId(userId: string, page: number) {
    return this.items.filter(item => item.user_id === userId).slice((page - 1) * 20, page * 20);
  }

  async countByUserId(userId: string) {
    return this.items.filter(item => item.user_id === userId).length;
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

  async save(checkIn: CheckIn) {
    const checkInIndex = this.items.findIndex(item => item.id === checkIn.id);

    if (checkInIndex >= 0) {
      this.items[checkInIndex] = checkIn;
    }

    return checkIn;
  }
}
