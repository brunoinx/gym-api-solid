import { FastifyReply, FastifyRequest } from 'fastify';
import { makeFetchNearbyGymsUseCase } from 'use-cases/_factories/make-fetch-nearby-gyms-use-case';
import z from 'zod';

export async function nearbyGymController(request: FastifyRequest, reply: FastifyReply) {
  const gymsNearbyQuerySchema = z.object({
    latitude: z.coerce.number().refine(value => Math.abs(value) <= 90),
    longitude: z.coerce.number().refine(value => Math.abs(value) <= 180),
  });

  const { latitude, longitude } = gymsNearbyQuerySchema.parse(request.query);

  const findManyNearbyGymsUseCase = makeFetchNearbyGymsUseCase();

  const gyms = await findManyNearbyGymsUseCase.execute({
    userLatitude: latitude,
    userLongitude: longitude,
  });

  return reply.status(200).send(gyms);
}
