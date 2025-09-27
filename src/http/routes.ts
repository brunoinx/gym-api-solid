import { FastifyInstance } from 'fastify';
import { registerController } from './controllers/register';
import { authenticateController } from './controllers/authenticate';

export async function appRoutes(fastify: FastifyInstance) {
  fastify.post('/users', registerController);
  fastify.post('/sessions', authenticateController);
}
