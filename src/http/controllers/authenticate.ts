import { FastifyReply, FastifyRequest } from 'fastify';
import z from 'zod';

import { PrismaUsersRepository } from 'repositories/prisma/users.repository';
import { AuthenticateUseCase } from 'use-cases/authenticate';
import { InvalidCredentialsError } from 'errors/invalid-credentials';

export async function authenticateController(request: FastifyRequest, reply: FastifyReply) {
  const authenticateUserSchema = z.object({
    email: z.email(),
    password: z.string().min(6),
  });

  const { email, password } = authenticateUserSchema.parse(request.body);

  try {
    const usersRepository = new PrismaUsersRepository();
    const authenticateUseCase = new AuthenticateUseCase(usersRepository);

    await authenticateUseCase.execute({ email, password });
  } catch (error) {
    if (error instanceof InvalidCredentialsError) {
      return reply.status(400).send({ message: error.message });
    }

    throw error;
  }

  return reply.status(200).send();
}
