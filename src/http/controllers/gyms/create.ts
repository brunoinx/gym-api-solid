import { FastifyReply, FastifyRequest } from 'fastify';
import z from 'zod';

import { makeCreateGymUseCase } from 'use-cases/_factories/make-create-gyms-user-case';

export async function createGymController(request: FastifyRequest, reply: FastifyReply) {
  const createGymBodySchema = z.object({
    name: z.string(),
    description: z.string().nullable(),
    phone: z.string().nullable(),
    latitude: z.coerce.number().refine(value => Math.abs(value) <= 90),
    longitude: z.coerce.number().refine(value => Math.abs(value) <= 180),
  });

  const { name, description, phone, latitude, longitude } = createGymBodySchema.parse(request.body);

  const createGymUseCase = makeCreateGymUseCase();

  await createGymUseCase.execute({
    name,
    description,
    phone,
    latitude,
    longitude,
  });

  return reply.status(201).send();
}
