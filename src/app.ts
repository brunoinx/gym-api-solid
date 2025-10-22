import fastifyJwt from '@fastify/jwt';
import { env } from 'env';
import fastify from 'fastify';
import z, { ZodError } from 'zod';

import { appRoutes } from 'http/routes';

export const app = fastify();

app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
});

app.register(appRoutes);

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
