import { FastifyReply, FastifyRequest } from 'fastify';
import z from 'zod';

import { UserAlreadyExistsError } from 'errors/user-already-exists';
import { makeRegisterUseCase } from 'use-cases/_factories/make-register-use-case';

export async function registerController(request: FastifyRequest, reply: FastifyReply) {
  const registerUserSchema = z.object({
    name: z.string(),
    email: z.email(),
    password: z.string().min(6),
  });

  const { name, email, password } = registerUserSchema.parse(request.body);

  try {
    const registerUseCase = makeRegisterUseCase();
    await registerUseCase.execute({ name, email, password });
  } catch (error) {
    if (error instanceof UserAlreadyExistsError) {
      return reply.status(409).send({ message: error.message });
    }

    throw error;
  }

  return reply.status(201).send();
}
