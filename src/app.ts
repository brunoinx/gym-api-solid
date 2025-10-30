import fastify from 'fastify';
import fastifyJwt from '@fastify/jwt';
import fastifyCookie from '@fastify/cookie';
import { env } from 'env';
import z, { ZodError } from 'zod';

import { usersRoutes } from 'http/controllers/users/routes';
import { gymsRoutes } from 'http/controllers/gyms/routes';
import { checkInsRoutes } from 'http/controllers/check-ins/routes';

export const app = fastify();

app.register(fastifyCookie);

app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
  cookie: {
    cookieName: 'refreshToken',
    signed: false,
  },
  sign: { expiresIn: '10m' },
});

app.register(usersRoutes);
app.register(gymsRoutes);
app.register(checkInsRoutes);

app.setErrorHandler((error, _, reply) => {
  if (error instanceof ZodError) {
    return reply.status(400).send({ message: 'Validation error.', issues: z.treeifyError(error) });
  }

  if (env.NODE_ENV !== 'production') {
    console.error(error);
  } else {
    // TODO: Here we should log to an external tool like DataDog/NewRelic/Sentry;
  }

  if (error instanceof Error) {
    return reply.status(400).send({ message: error.message });
  }

  return reply.status(500).send({ message: 'Internal server error.' });
});
