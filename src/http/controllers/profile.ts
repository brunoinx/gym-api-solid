import { FastifyReply, FastifyRequest } from 'fastify';
import { makeGetUserProfileUseCase } from 'use-cases/_factories/make-get-user-profile-use.case';

export async function profileController(request: FastifyRequest, reply: FastifyReply) {
  const getUserProfileUseCase = makeGetUserProfileUseCase();

  const { user } = await getUserProfileUseCase.execute({
    // @ts-expect-error sub is a string
    userId: request.user.sub,
  });

  const userWithoutPassword = {
    ...user,
    password_hash: undefined,
  };

  return reply.status(200).send({ user: userWithoutPassword });
}
