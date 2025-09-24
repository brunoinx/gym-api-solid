import { FastifyInstance } from 'fastify';
import { registerController } from './controllers/register';

export async function appRoutes(fastify: FastifyInstance) {
  fastify.post('/users', registerController);
}
