import { FastifyReply, FastifyRequest } from 'fastify';
import z from 'zod';

import { makeValidateCheckInUseCase } from 'use-cases/_factories/make-validate-check-in-use-case';

export async function validateCheckInsController(request: FastifyRequest, reply: FastifyReply) {
  const validateCheckInParamsSchema = z.object({
    checkInId: z.ulid(),
  });

  const { checkInId } = validateCheckInParamsSchema.parse(request.params);

  const validateCheckInUseCase = makeValidateCheckInUseCase();

  await validateCheckInUseCase.execute({ checkInId });

  return reply.status(204).send();
}
