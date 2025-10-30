import { FastifyInstance } from 'fastify';
import { registerController } from './register';
import { authenticateController } from './authenticate';
import { profileController } from './profile';
import { verifyJwt } from 'middlewares/verify-jwt';

export async function usersRoutes(app: FastifyInstance) {
  app.post('/users', registerController);
  app.post('/sessions', authenticateController);

  /**Authenticated */
  app.get('/users/me', { onRequest: [verifyJwt] }, profileController);
}
