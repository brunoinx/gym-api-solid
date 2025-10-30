import { FastifyReply, FastifyRequest } from 'fastify';
import { makeFetchUserCheckInsHistoryUseCase } from 'use-cases/_factories/make-fetch-user-check-ins-history-use-case';
import z from 'zod';

export async function historyCheckInsController(request: FastifyRequest, reply: FastifyReply) {
  const checkInHistoryQuerySchema = z.object({
    page: z.coerce.number().min(1).default(1),
  });

  const { page } = checkInHistoryQuerySchema.parse(request.query);

  const checkInHistoryUseCase = makeFetchUserCheckInsHistoryUseCase();

  const { checkIns } = await checkInHistoryUseCase.execute({
    userId: request.user.sub,
    page,
  });

  return reply.status(200).send({ checkIns });
}
