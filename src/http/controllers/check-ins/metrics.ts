import { FastifyReply, FastifyRequest } from 'fastify';
import { makeGetUserMetricsUseCase } from 'use-cases/_factories/make-get-user-metrics-use-case';

export async function metricsCheckInsController(request: FastifyRequest, reply: FastifyReply) {
  const checkInHistoryUseCase = makeGetUserMetricsUseCase();

  const { checkInsCount } = await checkInHistoryUseCase.execute({ userId: request.user.sub });

  return reply.status(200).send({ checkInsCount });
}
