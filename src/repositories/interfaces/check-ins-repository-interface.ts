import { Prisma, CheckIn } from '@prisma/client';

export interface ICheckInsRepository {
  create(data: Prisma.CheckInUncheckedCreateInput): Promise<CheckIn>;
  // Verificar se o usuário ja fez check-in nessa data
  findByUserIdOnDate(userId: string, date: Date): Promise<CheckIn | null>;
}
