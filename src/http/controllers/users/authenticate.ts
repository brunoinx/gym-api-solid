import { FastifyReply, FastifyRequest } from 'fastify';
import z from 'zod';

import { InvalidCredentialsError } from 'errors/invalid-credentials';
import { makeAuthenticateUseCase } from 'use-cases/_factories/make-authenticate-use-case';

export async function authenticateController(request: FastifyRequest, reply: FastifyReply) {
  const authenticateUserSchema = z.object({
    email: z.email(),
    password: z.string().min(6),
  });

  const { email, password } = authenticateUserSchema.parse(request.body);

  try {
    const authenticateUseCase = makeAuthenticateUseCase();

    const { user } = await authenticateUseCase.execute({ email, password });

    const accessToken = await reply.jwtSign(
      {},
      {
        sign: {
          sub: user.id,
        },
      },
    );

    const refreshToken = await reply.jwtSign(
      {},
      {
        sign: {
          sub: user.id,
          expiresIn: '7d',
        },
      },
    );

    return reply
      .status(200)
      .setCookie('refreshToken', refreshToken, {
        path: '/',
        secure: true,
        sameSite: true,
        httpOnly: true,
      })
      .send({ token: accessToken });
  } catch (error) {
    if (error instanceof InvalidCredentialsError) {
      return reply.status(400).send({ message: error.message });
    }

    throw error;
  }

  return reply.status(200).send();
}
